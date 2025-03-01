<template>
	<q-page
		padding
		class="flex justify-center"
	>
		<div
			class="fit"
			style="max-width: 1200px"
		>
			<q-breadcrumbs class="q-mb-md">
				<q-breadcrumbs-el
					icon="home"
					:to="{ name: 'App.Home' }"
				/>
				<q-breadcrumbs-el :label="$t('app.feature.index')" />
			</q-breadcrumbs>

			<index-filter-panel
				v-model:keywords="keywordList"
				v-model:categories="categoryList"
			></index-filter-panel>

			<div class="row q-col-gutter-md">
				<div
					class="col-md-4 col-sm-6 col-12"
					v-for="item in filterd"
					:key="item.id"
				>
					<index-item-card :data="item"></index-item-card>
				</div>
			</div>
		</div>
	</q-page>
</template>

<script setup lang="ts">
import type { IndexItem } from './Item.vue';

import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { CATEGORY } from 'src/Spec';
import primary from 'src/documentation/primary.json';

import IndexItemCard from './Item.vue';
import IndexFilterPanel from './Filter.vue';

const { t } = useI18n();
const keywordList = ref<string[]>([]);
const categoryList = ref<number[]>([]);

const route = useRoute();
const router = useRouter();
const query = route.query;

if (Object.hasOwn(query, 'keyword') && typeof query.keyword === 'string') {
	keywordList.value = query.keyword.split(',');
}

if (Object.hasOwn(query, 'category') && typeof query.category === 'string') {
	categoryList.value = query.category.split(',').map((v) => Number(v));
}

const indexItemList = ref<(typeof primary)[0][]>([]);

const filterd = computed<IndexItem[]>(() => {
	let result = indexItemList.value.map((item) => {
		const { author, source } = item;

		return {
			...item,
			author: author.length > 0 ? author.join(', ') : t('typo.title.unknown.author'),
			source: source === null ? t('typo.title.unknown.source') : source,
			category: item.category.map((name) => {
				return CATEGORY.TO_VALUE[name as keyof typeof CATEGORY.TO_VALUE];
			}),
		};
	});

	for (const keyword of keywordList.value) {
		const reg = new RegExp(`\\S*${keyword}\\S*`, 'i');
		const TEST_DATA = (data: string) => reg.test(data);

		result = result.filter((item) => {
			const { abstract, author, source, title } = item;

			return [abstract, author, source, title].some(TEST_DATA);
		});
	}

	for (const category of categoryList.value) {
		result = result.filter((item) => item.category.includes(category));
	}

	return result;
});

onMounted(() => {
	indexItemList.value = primary;
	router.replace({ query: {} });
});

defineOptions({ name: 'AppContentOverview' });
</script>
