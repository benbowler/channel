// App!

function app()
{

    if(!$.user.logged_in) {
        // User logged out

        $.tubeplayer.defaults.afterReady = function($player){
        };

    } else {
        // User logged in!
        // @todo: if tour == 'first'
        //runTour();

        //processLinks();

        $.tubeplayer.defaults.afterReady = function($player){

            $("#login").fadeOut();

        };

        if($.user.newuser == 'first') {
            createChannel();
        }

    }

    /* 
     *  Triggers
     *
     *  Click hover etc for all function
     */

    $(".skip").click(function (e) {
        e.preventDefault();
        //$(".skip").html('skipping'); @todo: spin.js?
        nextVideo();
    });

    $(".love").click(function (e) {
        e.preventDefault();
        var currentState = $(".love").data("lovestate");
        toggleLove(currentState);
    });

    $(".info").hover(function (e) {
        console.log('expand info');
        $("#video_info").fadeIn();
    });
    $('#video_info').on("mouseleave",function(){
        $("#video_info").fadeOut();
    });



    /*   Chanl functions
    */

    function createChannel() {
        console.log('create first channel');
        $('#create_channel').fadeIn();
    }

    $(".tag").click(function (e) {
        e.preventDefault();
        var tag = '.' + $(this).data("tag");

        console.log(tag);
        $('.categorys-title').fadeOut('500', function () {
            $('.tags-title').fadeIn();
        });
        $('#categorys').fadeOut('500', function () {
            $('.next').fadeIn();
            $(tag).fadeIn();
        });
    });

    $(".tags .checkbox").click(function (e) {
        //e.preventDefault();
        console.log('click check');
        $(this).parent().toggleClass('selected');
        $(this).find("input:checkbox").attr('checked', true);
        return false;
    });


    $(".next").click(function (e) {
        e.preventDefault();
        //var tag = '.' + $(this).data("tag");
        var titles = new Array();

        // Define playlist
        $.playlist = new Array();

        $('.checkbox').each(function() {

            var target = $(this);
            if (target.find("input:checkbox").is(":checked")) {
                getVideos(target.find("input").attr("name"));
            }
        });

        console.log(titles);
    });

    function getVideos(search) {
        console.log(apiCall('http://gdata.youtube.com/feeds/api/videos', { 'q' : search, 'start-index' : 1, 'max-results' : 5, 'v' : 2, 'alt': 'json' }, search, processVideos));
    }

    function processVideos(search, videos)
    {
        console.log(videos);
        videos.feed.entry.forEach(function (val, index, theArray) {

            val.suggestion = search;
            var ytID = val.id.$t.split(":");
            val.ytID = ytID[3];

            $.playlist.push(val);

            if($.playliststarted !== true) {
                startPlayer();
                $.playliststarted = true;
            }

        });
    }

    function startPlayer() {
        console.log('start player');
        $('#create_channel').fadeOut();

        $('#player').fadeIn();

        // Setup video

        $.video = $.playlist[Math.floor(Math.random()*$.playlist.length)];

        console.log('first play');
        console.log($.video.ytID);

        jQuery("#player-yt").tubeplayer({
            width: '100%', // the width of the player
            height: '100%', // the height of the player
            allowFullScreen: "true", // true by default, allow user to go full screen
            showControls: 1,
            autoPlay: true,
            showInfo: false,
            protocol: 'https',
            theme: "light",
            color: "white",
            modestbranding: true,
            initialVideo: $.video.ytID, // the video that is loaded into the player
            preferredQuality: "default", // preferred quality: default, small, medium, large, hd720
            //onPlay: onVideoPlay, // after the play method is called
            //onPause: stopWatchVideo, // after the pause method is called
            //onStop: function () {}, // after the player is stopped
            //onSeek: function (time) {}, // after the video has been seeked to a defined point
            //onMute: stopWatchVideo, // after the player is muted
            //onUnMute: setWatchVideo, // after the player is unmuted
            onPlayerEnded: nextVideo(), // after the video completely finishes
            //onErrorNotFound: nextVideo(), // if a video cant be found
            //onErrorNotEmbeddable: nextVideo(), // if a video isnt embeddable
            //onErrorInvalidParameter: nextVideo(), // if we've got an invalid param
            mute: false
        });
    }

    //playV

    /* Helper functions */
    function apiCall(url, data, search, callback) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            data: data,
            url: url,
            success: function (response) {
                console.log('success');

                callback(search, response);

            },
            error: function (data) {

                console.log('error');
                console.log(data);
            }
        });
    }

    /* 
     *  Function
     *
     */

    function onVideoPlay() {
        // Make description links external @todo: move after video load
        // processLinks();
    }


    $(".next-video").click(function (e) {
        e.preventDefault();
        nextVideo();
    });

    $(".pervious-video").click(function (e) {
        e.preventDefault();
        nextVideo('previous');
    });


    // Actions
    function nextVideo(video) {
        console.log('loading video + next virtual page.');

        if(video == 'previous') {
            $.video = $.previousVideo();
        } else {

            $.previousVideo = $.video;

            $.video = $.playlist[Math.floor(Math.random()*$.playlist.length)];

        }

        console.log('play');
        console.log($.video.ytID);

        jQuery("#player-yt").tubeplayer('play', $.video.ytID);

        $('.video-title').html($.video.title.$t);
        $('.video-description').html($.video.media$group.media$description.$t);

    }

    /*
    function setUserLikeState(userLikes) {

        if(userLikes) {
            // Get current love state
            requestData = {
                user : $.user._id,
                video : $.video._id
            };

            $.ajax({
                type: 'POST',
                dataType: "json",
                data: requestData,
                url: '/api:userlike',
                success: function (data) {
                    if(data.response === true) {
                        $(".love").data('lovestate','loved');
                        $(".love > i").removeClass("icon-heart-2 icon-heart-broken").addClass("icon-heart");
                    } else {
                        $(".love").data('lovestate','love');
                        $(".love > i").removeClass("icon-heart-broken icon-heart").addClass("icon-heart-2");
                    }
                }
            });

        } else {
            //$('#video_status').html('something you might like');
        }

    }
    */


    function processLinks() {
        // Make description links external
        $(".video_description a[href^='http://']").attr("target","_blank");
        $(".video_description a[href^='https://']").attr("target","_blank");

        // @todo: search for and create buy links..
    }

    // Facebook

    function logResponse(response) {
        if (console && console.log) {
            console.log('The response was', response);
        }
    }

    // Set up so we handle click on the buttons
    $('.fb-login').click(function (e) {
        e.preventDefault();

        fbJsLogin();
    });

    function fbJsLogin()
     {
        FB.login(function(response) {
            var url = [location.protocol, '//', location.host, '/', $.video.slug].join(''); // , location.pathname
            window.location = url;
        }, {scope: 'email,user_likes,publish_actions'});
     }


    /*
    // Set up so we handle click on the buttons
    $('#postToWall').click(function () {
        FB.ui({
            method: 'feed',
            link: $(this).attr('data-url')
        },

        function (response) {
            // If response is null the user canceled the dialog
            if (response !== null) {
                logResponse(response);
            }
        });
    });


    $('#sendToFriends').click(function () {
        FB.ui({
            method: 'send',
            link: $(this).attr('data-url')
        },

        function (response) {
            // If response is null the user canceled the dialog
            if (response !== null) {
                logResponse(response);
            }
        });
    });
    $('.recommend').click(function () {
        FB.ui({
            method: 'apprequests',
            message: $(this).attr('data-message')
        },

        function (response) {
            // If response is null the user canceled the dialog
            if (response !== null) {
                logResponse(response);
            }
        });
    });

*/
}