<section id="create_channel">
	<?php // var_dump($user['likes']);

	$categorys = array();

	function merge_categorys($category)
	{
		switch ($category) {
			case "Website":										return "Web";	break;
			case "Organization":								return "Product/Service"; break;
			case "Musician/band":								return "Music";	break;
			case "Company":										return "Product/Service";	break;
			case "Business/economy website":					return "Product/Service";	break;
			case "Artist":										return "Arts";	break;
			case "Music":										return "Music";	break;
			case "Producer":									return "People";	break;
			case "Clothing":									return "Fashion";	break;
			case "Software":									return "Tech";	break;
			case "Professional services":						return "Interest";	break;
			case "Movies/music":								return "Music";	break;
			case "Internet/software":							return "Tech";	break;
			case "App page":									return "Tech";	break;
			case "Record label":								return "Music";	break;
			case "Playlist":									return "Music";	break;
			case "Music chart":									return "Music";	break;
			case "Musical instrument":							return "Music ";	break;
			case "Literary editor":								return "Literature/Publishing";	break;
			case "Tv network":									return "Film/TV ";	break;
			case "City":										return "Place";	break;
			case "Restaurant/cafe":								return "Food";	break;
			case "Shopping/retail":								return "Shopping";	break;
			case "Community":									return "Group";	break;
			case "Fictional character":							return "Interest";	break;
			case "Club":										return "Music";	break;
			case "Entertainment website":						return "Web";	break;
			case "Transport/freight":							return "Interest";	break;
			case "Product/service":								return "Product/Service";	break;
			case "Media/news/publishing":						return "Literature/Publishing";	break;
			case "Concert tour":								return "Music";	break;
			case "Food/beverages":								return "Food";	break;
			case "Retail and consumer merchandise":				return "Product/Service";	break;
			case "Sports/recreation/activities":				return "Recreation/Activity";	break;
			case "Actor/director":								return "Film/TV";	break;
			case "Movie":								return "Film/TV";	break;
			case "Computers/internet website":								return "Tech";	break;
			case "Electronics":								return "Tech";	break;
			case "Tv show":								return "Film/TV";	break;
			case "Consulting/business services":								return "Product/Service";	break;
			case "Radio station":								return "Radio";	break;
			case "Attractions/things to do":								return "Recreation/Activity";	break;
			case "Telecommunication":								return "Tech";	break;
			case "Magazine":								return "Literature/Publishing";	break;
			case "Video":								return "Film/TV";	break;
			case "Jewelry/watches":								return "Product/Service";	break;
			case "Album":								return "Music";	break;
			case "Profile":								return "People";	break;
			case "Personal blog":								return "People";	break;
			case "Comedian":						return "Humour";	break;
			case "Local business":								return "Product/Service";	break;
			case "Society/culture website":					return "Web";	break;
			case "Event planning/event services":								return "Recreation/Activity";	break;
			case "News/media website":	return "News";	break;
			case "Song":								return "Music";	break;
			case "Athlete":								return "Sport";	break;
			case "Food/grocery";	break;
			case "Musical genre":								return "Music";	break;
			case "Automotive":								return "Automotive";	break;
			case "Public figure":								return "People";	break;
			case "Drink":								return "Interest";	break;
			case "Wine/spirits Interest ";	break;
			case "Arts/entertainment/nightlife":	return "Interest";	break;
			case "Concert venue":								return "Music";	break;
			case "Government organisation ":								return "Product/Service";	break;
			case "Non-profit organisation ":								return "Product/Service";	break;
			case "Movie theater":								return "Film/TV";	break;
			case "Travel/leisure":	return "Travel";	break;
			case "Entertainer":	return "Interest";	break;
			case "Professional sports team":								return "Sport";	break;
			case "Health/beauty Health/Beauty";	break;
			case "Arts/humanities website":								return "Arts";	break;
			case "University":								return "Education";	break;
			case "Recreation/sports website":								return "Sport";	break;
			case "Bar":								return "Entertainment";	break;
			case "Landmark":				return "Place";	break;
			case "Dancer":				return "Dance";	break;
			case "Local/travel website":	return "Travel";	break;
			case "Outdoor gear/sporting goods":	return "Travel";	break;
			case "Book":								return "Literature/Publishing";	break;
			case "Computers/technology":								return "Tech";	break;
			case "Cause":								return "Product/Service";	break;
			case "Field of study":								return "Education";	break;
			case "Cars":								return "Automotive";	break;
			case "Games/toys":								return "Entertainment";	break;
			case "Politician":								return "People";	break;
			case "Education":								return "Education";	break;
			case "Personal website":								return "People";	break;
			case "Sport":								return "Sport";	break;
			case "Non-governmental organization (ngo)":								return "Product/Service";	break;
			case "Movie genre":							return "TV/Film";	break;
			default: return $category; 
		}
	}


	foreach ($user['likes'] as $likes) {
		foreach ($likes as $like) {
			if($like['category'] != 'Other' && $like['category'] != 'h') {

				$like['category'] = merge_categorys($like['category']);

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

		<?php 
			$i = 1;
			$target = count($category['tags']);
			foreach ($category['tags'] as $tag) {
		?>
	
			<li><label class="checkbox"><input type="checkbox" name="<?php echo $tag['name']; ?>" /><span><?php echo $tag['name']; ?></span><em><?php echo $tag['category']; ?></em></label></li>

		<?php 
			if($i == $target/2) {
				echo '<div class="clear"></div>';
			}

			$i++;
			}
		?>

	</ul>
	
	<?php endforeach; ?>
	<span class="next-wrapper">
		<a class="next btn">Watch</a>
	</span>
</section>