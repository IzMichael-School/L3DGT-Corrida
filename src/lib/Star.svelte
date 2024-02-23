<script lang="ts">
    export let filled = false;
</script>

<div class="star relative h-12 w-12 overflow-hidden bg-gray-100 p-1">
    <div
        class="star absolute inset-1 h-10 w-10 overflow-hidden bg-blue-300 p-1 transition-opacity duration-300 ease-in-out {filled
            ? 'opacity-100'
            : 'opacity-0'}"
    />
</div>

<style>
    .star {
        clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    }
</style>
