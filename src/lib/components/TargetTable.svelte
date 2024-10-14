<script lang="ts">
	import type { Target } from '$lib/types';

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
