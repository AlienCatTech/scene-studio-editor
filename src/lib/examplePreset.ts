export default {
	'00:00:00': [
		{
			service: 'todo.add_item',
			data: {
				item: 'Hello from Scene Studio!'
			},
			target: {
				entity_id: 'todo.shopping_list'
			}
		}
	],
	'00:00:05': [
		{
			service: 'todo.update_item',
			data: {
				item: 'Hello from Scene Studio!',
				rename: "The next sun set is {{states('sensor.sun_next_setting')}}"
			},
			target: {
				entity_id: 'todo.shopping_list'
			}
		}
	],
	'00:00:10': [
		{
			service: 'todo.remove_item',
			data: {
				item: "The next sun set is {{states('sensor.sun_next_setting')}}"
			},
			target: {
				entity_id: 'todo.shopping_list'
			}
		}
	]
};
