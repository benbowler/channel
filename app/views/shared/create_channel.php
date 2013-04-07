<section id="create_channel">
	<?php // var_dump($user['likes']);

	$categorys = array();

	foreach ($user['likes'] as $likes) {
		foreach ($likes as $like) {
			if($like['category'] != 'Other' && $like['category'] != 'h') {

				if(array_key_exists($like['category'], $categorys)) {
					$categorys[$like['category']]['count'] = $categorys[$like['category']]['count']+1;

					//$tags[$like['category']]['tags'] = $like['name'];
					array_push($categorys[$like['category']]['tags'], array('name' => $like['name'], 'category' => $like['category']));
				} else {
					$categorys[$like['category']]['count'] = 1;
					$categorys[$like['category']]['name'] = $like['category'];
					$categorys[$like['category']]['class'] = str_replace('/', '-', $like['category']);

					//$tags[$like['category']]['tags'] = array(0 => $like['name']);
					$categorys[$like['category']]['tags'] = array(0 => array('name' => $like['name'], 'category' => $like['category']));
				}
			}
		}
	}
	//var_dump($categorys);
	arsort($categorys);
	$categorys = array_slice($categorys, 0, 10);
	?>

	<h3 class="categorys-title">To build your first channel, Start by selecting a category below</h3>
	<ul id="categorys">

	<?php foreach ($categorys as $category): ?>

		<li><a class="tag" data-tag="<?php echo $category['class']; ?>"><?php echo $category['name']; ?></a>
			<em><?php echo $category['count']; ?></em>
		</li>
	
	<?php endforeach; ?>

	</ul>


	<h3 class="tags-title">What tags would you like to add to your channel?</h3>
	<?php foreach ($categorys as $category): ?>

	<ul class="tags <?php echo $category['class']; ?>">

		<?php foreach ($category['tags'] as $tag): ?>
	
			<li class="checkbox"><label><input type="checkbox" name="<?php echo $tag['name']; ?>" /><?php echo $tag['name']; ?><em><?php echo $tag['category']; ?></em></label></li>

		<?php endforeach; ?>

	</ul>
	
	<?php endforeach; ?>
	<span class="next-wrapper">
		<a class="next btn">Next</a>
	</span>
</section>