<section id="create_channel">
	<div>
		<h1>Create your first channel</h1>
		<?php // var_dump($user['likes']);

			$categorys = array();

			foreach ($user['likes'] as $likes) {
				foreach ($likes as $like) {
					if($like['category'] != 'Other') {

						if(array_key_exists($like['category'], $categorys)) {
							$categorys[$like['category']]['count'] = $categorys[$like['category']]['count']+1;

							//$tags[$like['category']]['tags'] = $like['name'];
							array_push($categorys[$like['category']]['tags'], $like['name']);
						} else {
							$categorys[$like['category']]['count'] = 1;
							$categorys[$like['category']]['name'] = $like['category'];
							$categorys[$like['category']]['class'] = str_replace('/', '-', $like['category']);

							//$tags[$like['category']]['tags'] = array(0 => $like['name']);
							$categorys[$like['category']]['tags'] = array(0 => $like['name']);
						}
					}
				}
			}
			arsort($categorys);
			$categorys = array_slice($categorys, 0, 10);
			?>
			<ul id="categorys">

			<?php foreach ($categorys as $category): ?>

				<li><a class="tag" data-tag="<?php echo $category['class']; ?>"><?php echo $category['name']; ?></a>
					<em><?php echo $category['count']; ?></em>
				</li>
			
			<?php endforeach; ?>

			</ul>


			<?php foreach ($categorys as $category): ?>
			<ul class="tags <?php echo $category['class']; ?>">

				<?php foreach ($category['tags'] as $tag): ?>
			
					<li class="checkbox"><label><input type="checkbox" name="<?php echo $tag; ?>" /><?php echo $tag; ?></label></li>

				<?php endforeach; ?>

				<a class="next">Next</a>
			</ul>
			

			<?php endforeach; ?>


	</div>
</section>