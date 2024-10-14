<script lang="ts">
	export let visible = false;
	export let errMsg = '';
</script>

{#if visible}
	<aside class="alert variant-filled-error">
		<!-- Message -->
		<div class="alert-message">
			<p>{errMsg}</p>
		</div>
	</aside>
{/if}
