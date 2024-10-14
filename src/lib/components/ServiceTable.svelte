<script lang="ts">
	import { components, removeTime } from '$lib/common';
	import { preset } from '$lib/store';
	import type { SceneStudioSchema, Target, TimePattern } from '$lib/types';
	import { Flexilte } from '@flexilte/core';
	import type { LayoutConfig } from '@flexilte/core';
	import ServiceTable from './ServiceTable.svelte';
	import TargetTable from './TargetTable.svelte';
	import Icon from '@iconify/svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	export let services: TimePattern;
	export let time: string;

	const handleEdit = (time: string) => {
		const timeModal: ModalSettings = {
			type: 'component',
			component: 'timeModal',
			meta: time
		};
		modalStore.trigger(timeModal);
	};

	const handleNew = () => {
		const timeModal: ModalSettings = {
			type: 'component',
			component: 'timeModal'
		};
		modalStore.trigger(timeModal);
	};

	function handleRemove(time: string) {
		preset.update((p) => {
			return removeTime(time, p);
		});
	}
</script>

<div class="table-container">
	<!-- Native Table Element -->
	<table class="table table-hover hover:bg-gray-700">
		<tbody>
			{#each Object.keys(services) as s, i}
				<tr>
					<td class="border-r border-gray-600 pr-4">{s}</td>
					<td>
						{JSON.stringify(services[s].data, null, 2)}
					</td>
					<td>
						<TargetTable targets={services[s].target}></TargetTable>
					</td>
					<td>
						<div class="flex flex-row gap-2">
							<button type="button" class="btn-icon variant-filled-tertiary" on:click ={() => handleEdit(time)}
								><Icon icon="ic:baseline-edit"></Icon></button
							>

							<button type="button" class="btn-icon variant-filled-error"on:click ={() => handleRemove(time)}
								><Icon icon="ic:baseline-delete"></Icon></button
							>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
