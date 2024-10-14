<script lang="ts">
	import { components, removeTime, sortPreset } from '$lib/common';
	import { preset } from '$lib/store';
	import type { SceneStudioSchema } from '$lib/types';
	import { Flexilte } from '@flexilte/core';
	import type { LayoutConfig } from '@flexilte/core';
	import ServiceTable from './ServiceTable.svelte';
	import Icon from '@iconify/svelte';

	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';

	$: sortedTable = sortPreset($preset);

	const modalStore = getModalStore();

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
	<table class="table table-hover">
		<tbody>
			{#each Object.keys(sortedTable) as time, i}
				<tr>
					<td
						class="border-r border-gray-600 pr-4 cursor-pointer"
						on:click={() => handleEdit(time)}
					>
						<div class="text-center">
							{time}
						</div>
					</td>
					<td>
						<div class="flex gap-4 flex-col">
							<ServiceTable services={$preset[time]} {time}></ServiceTable>
							<div class="flex flex-row gap-2">
								<button type="button" class="btn-icon variant-filled-primary"
									><Icon icon="ic:baseline-plus"></Icon></button
								>
								<button
									type="button"
									class="btn-icon variant-filled-error"
									on:click={() => handleRemove(time)}
									><Icon icon="ic:baseline-delete"></Icon></button
								>
							</div>
						</div>
					</td>
				</tr>
			{/each}
			<div class="m-4">
				<button type="button" class="btn-icon variant-filled-primary" on:click={handleNew}
					><Icon icon="ic:baseline-plus"></Icon></button
				>
			</div>
		</tbody>
	</table>
</div>
