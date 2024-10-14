<script lang="ts">
	import { components } from '$lib/common';
	import { preset } from '$lib/store';
	import type { SceneStudioSchema, Target, TimePattern } from '$lib/types';
	import { Flexilte } from '@flexilte/core';
	import type { LayoutConfig } from '@flexilte/core';
	import ServiceTable from './ServiceTable.svelte';

	export let targets: Target | undefined;
</script>

{#if targets}
	<div class="table-container">
		<!-- Native Table Element -->
		<table class="table table-hover border border-gray-600">
			<tbody>
				{#if targets.entity_id}
					<tr>
						<td class="border-r border-gray-600 pr-4">entity_id</td>
						<td>
							{targets.entity_id}
						</td>
					</tr>
				{/if}
				{#if targets.device_id}
					<tr>
						<td class="border-r border-gray-600 pr-4">device_id</td>
						<td>
							{targets.device_id}
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
{/if}
