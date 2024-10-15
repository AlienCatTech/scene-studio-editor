<script lang="ts">
	import { removeItemFromDict, sortPreset } from '$lib/common';
	import { preset } from '$lib/store';
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

	const handleNewTime = () => {
		const timeModal: ModalSettings = {
			type: 'component',
			component: 'timeModal'
		};
		modalStore.trigger(timeModal);
	};

	const handleNewService = (time: string) => {
		const timeModal: ModalSettings = {
			type: 'component',
			component: 'serviceModal',
			meta: { time }
		};
		modalStore.trigger(timeModal);
	};

	function handleRemove(time: string) {
		preset.update((p) => {
			return removeItemFromDict(time, p);
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
						class="border-r border-gray-600 pr-4 cursor-pointer table-cell-fit"
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
								<button
									type="button"
									class="btn-icon variant-filled-primary"
									on:click={() => handleNewService(time)}
									><Icon icon="ic:baseline-plus"></Icon></button
								>
							</div>
						</div>
					</td>
					<td>
						<div class="my-12 flex justify-end">
							<button
								type="button"
								class="btn-icon variant-filled-error"
								on:click={() => handleRemove(time)}><Icon icon="ic:baseline-delete"></Icon></button
							>
						</div>
					</td>
				</tr>
			{/each}
			<div class="m-4">
				<button type="button" class="btn-icon variant-filled-primary" on:click={handleNewTime}
					><Icon icon="ic:baseline-plus"></Icon></button
				>
			</div>
		</tbody>
	</table>
</div>
