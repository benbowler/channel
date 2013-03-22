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
        runTour();

        makeLinksExternal();

        $.tubeplayer.defaults.afterReady = function($player){

            doPoints('return', '+20 for logging in today', 'come back again tomorrow for +20');

            $("#login").fadeOut();

            setTimeout(updatePoints, 1000);

            /*
            alertify.confirm( 'invite your friends for +50 points', function (e) {
                if (e) {
                    console.log('invited users' + e);

                    inviteUsers();
                } else {
                    console.log('invites cancelled');
                    //after clicking Cancel
                }
            });
            */

            // <div class="fb-like" data-href="http://facebook.com/eatbassnow" data-send="true" data-width="450" data-show-faces="true"></div>
        };

        if($.user.opengraph == 'first') {
            setOpenGraph('first');

            $.alertify.set({ labels: { ok: "ON", cancel: "OFF" } });
            $.alertify.confirm( '<h3>turn facebook sharing on</h3><br /><br />this means you are sharing the videos you watch with your friends. you can turn this off now, or anytime with the controls below.', function (e) {
                if (e) {
                    console.log('opted in to open graph ' + e);
                    setOpenGraph(true);
                } else {
                    console.log('opted out of open graph');

                    $('#toggleopengraph').bootstrapSwitch('setState', true);
                    setOpenGraph(false);
                }
            });
        }

        $.alertify.log('welcome to #eatbass');

    }

    $("#video_info").delay(5000).fadeOut();

    // Prepair video
    jQuery("#player-yt").tubeplayer({
        width: '100%', // the width of the player
        height: '100%', // the height of the player
        allowFullScreen: "true", // true by default, allow user to go full screen
        showControls: 0,
        autoPlay: true,
        showInfo: false,
        protocol: 'https',
        theme: "light",
        color: "white",
        modestbranding: false,
        initialVideo: $.video.ytID, // the video that is loaded into the player
        preferredQuality: "default", // preferred quality: default, small, medium, large, hd720
        onPlay: onVideoPlay, // after the play method is called
        //onPause: stopWatchVideo, // after the pause method is called
        //onStop: function () {}, // after the player is stopped
        //onSeek: function (time) {}, // after the video has been seeked to a defined point
        //onMute: stopWatchVideo, // after the player is muted
        //onUnMute: setWatchVideo, // after the player is unmuted
        onPlayerEnded: nextVideo, // after the video completely finishes
        onErrorNotFound: nextVideo, // if a video cant be found
        onErrorNotEmbeddable: nextVideo, // if a video isnt embeddable
        onErrorInvalidParameter: nextVideo, // if we've got an invalid param
        mute: true
    });

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

    $('#toggleopengraph').on('switch-change', function (e, data) {
        var $el = $(data.el)
            , value = data.value;
        console.log(e, $el, value);

        setOpenGraph(value);
    });

    $(".profile").click(function (e) {
        e.preventDefault();

        viewProfile();
    });



    $(".add-to-page").click(function (e) {
        // calling the API ...
        var obj = {
          method: 'pagetab',
          redirect_uri: window.location
        };

        FB.ui(obj);
    });

    /* 
     *  Function
     *
     *  
     */

    function onVideoPlay() {
        // Make description links external @todo: move after video load
        $("#video_description a[href^='http://']").attr("target","_blank");
    }

    // Actions
    function nextVideo() {
        console.log('loading video + next virtual page.');
        jQuery("#player-yt").tubeplayer("pause");
        // Clear fb delete option
        $('#fb-status').html('');
        // Loading spinner
        $("#player").spin("yt");

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/api:video',
            success: function (video) {
                console.log(video);

                jQuery("#player-yt").tubeplayer("play", video.media$group.yt$videoid.$t);

                $.video = {
                    _id : video._id,
                    slug : video.slug,
                    title : video.title.$t,
                    author : video.author[0].name.$t,
                    description : video.media$group.media$description.$t,
                    html_description : video.html_description,
                    picture : video.media$group.media$thumbnail[1].url
                };

                //if (video.html_description) { video.html_description } else { video.media$group.media$thumbnail[1].url }

                // Update page
                if($.user.logged_in) {
                    History.pushState(video, '\u25BA ' + video.title.$t + ' | ' + $.site.title, video.slug);
                }

                $('.video_title').html(video.title.$t);
                $('.video_channel').html(video.author[0].name.$t);
                $('.video_channel').attr('href', 'http://youtube.com/user/'+video.author[0].name.$t);
                $('.video_description').html(video.html_description);
                makeLinksExternal();

                $("#video_info").fadeIn();
                $("#video_info").delay(5000).fadeOut();

                //var picture = video.media$group.media$thumbnail[1].url.replace('http', 'https');

                _gaq.push(['_trackPageview', '/' + video.slug]);

                doPoints('play', '+1 point for watching');

                // Get current love state
                requestData = {
                    user : $.user._id,
                    video : $.video._id
                };

                $.ajax({
                    type: 'POST',
                    dataType: "json",
                    data: requestData,
                    url: '/api:lovestate',
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

                //$(".skip").html('skip');

                $("#player").spin(false);

                if($.user.opengraph) {
                    setTimeout(function() {
                        $('#fb-status').html('posting watch to facebook.');
                        doOpenGraph('video.watches');
                    }, 12000);
                }

            },
            error: function (data) {

                console.log('error'+data);

                $.alertify.error('error loading video :(');

                // On error do a full refresh
                //window.location = '/';
            }
        });
    }

    function toggleLove(currentState) {
        console.log('Changing video state:' + currentState);

        requestData = {
            user : $.user._id,
            video : $.video._id
        };

        if(currentState == 'love' || currentState == 'broken')
        {
            $(".love").data('lovestate','loved');
            $(".love > i").removeClass("icon-heart-2 icon-heart-broken").addClass("icon-heart");
            requestUrl = '/api:love';
        } else {
            $(".love").data('lovestate','broken');
            $(".love > i").removeClass("icon-heart-2 icon-heart").addClass("icon-heart-broken");
            requestUrl = '/api:unlove';
        }

        $.ajax({
            type: 'POST',
            data: requestData,
            url: requestUrl,
            success: function (data) {
                //////// Points and notify
                if(currentState == 'love')
                {
                    doLoveActions('love', 'eatbass:love');
                    //$(".love").html('loved');
                } else {

                    $.alertify.error('error loving track :(');

                    $(".love").data('lovestate','love');
                    $(".love > i").removeClass("icon-heart icon-heart-broken").addClass("icon-heart-2");
                }
            },
            error: function (data) {

                $.alertify.error('error loving track :(');

                $(".love").data('lovestate','love');
                $(".love > i").removeClass("icon-heart icon-heart-broken").addClass("icon-heart-2");
            }
        });
    }

    // Facebook Share functionality
    function shareVideo() {
        console.log('Sharing video ' + document.URL);

        var body = 'Loving ' + $.video['title'];
        FB.api('/me/feed', 'post', { message: body }, function(response) {
          if (!response || response.error) {
            alert('Error occured');
          } else {
            alert('Post ID: ' + response.id);
          }
        });
    }

    /*
    function inviteUsers() {

        FB.ui({
            method: 'apprequests',
            message: 'win music, tickets and merch by listening to the music you love',
            filters: ['app_non_users'],
            title: '#eatbass bass music tv'
        },
        function (response) {
            if (response && response.request_ids) {
                //if sucess do something
                //How many people did the user invited?
                var $howManyInvites = String(requests).split(',').length;

                doPoints('invite', '+50 for inviting friends', 'thanks for inviting friends');
            } else {
                //  alert('canceled');
                return false;
            }
        });
        return false;
    }
    */

    // Handle open graph and points
    function doWatchActions(openGraphMethod, pointsMethod) {
        //, '+1 point for playing'));
        console.log('doWatchActions triggered');

        // Send points
        //
        doPoints('play', '+1 point for watching');

        if($.user.opengraph) {
            console.log('wait 20 seconds');
            setTimeout(function() {
                $('#fb-status').html('posting watch to facebook.');
                doOpenGraph('video.watches');
            }, 20000);
        }
    }

    // Handle open graph and points
    function doLoveActions(openGraphMethod, pointsMethod) {
        //, '+1 point for playing'));
        console.log('doLoveActions triggered');

        // Send points
        doPoints('love', '+10 point for loving');

        if($.user.opengraph) {
            $('#fb-status').html('posting love to facebook.');
            doOpenGraph('eatbass:love');
        }
    }

    // Internal functions
    function doPoints(apiMethod, successMessage, failMessage) {
        console.log('registerring points: ' + apiMethod);

        requestData = {
            method : apiMethod,
            user : $.user._id,
            video : $.video._id
        };

        console.log(requestData);

        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: requestData,
            url: '/api:points',
            success: function (data) {

                console.log('scored points ');
                console.log(data);

                if(data.response === true) {
                    $.alertify.log(successMessage);

                    // @todo: Fix points update after daily login?
                    if(apiMethod != 'return') {
                        updatePoints();
                    }
                } else {
                    if(failMessage) {
                        $.alertify.log(failMessage);
                    }
                }
            },
            error: function (data) {
                console.log('failed connecting to api');
                console.log(data);

                $.alertify.log('error connecting to #eatbass');
            }
        });
    }

    function updatePoints() {
        console.log('updating user points');

        requestData = {
            user : $.user._id
        };

        console.log('updating user points'+requestData);

        $.ajax({
            type: 'POST',
            data: requestData,
            url: '/api:userpoints',
            success: function (data) {
                console.log(data);
                if(data === 0 || isNaN(data)) {
                    setTimeout(updatePoints(), 1000);
                } else {
                    $(".points").html(data);
                    $(".points").fadeOut(100).fadeIn(500);
                }
            }
            /* error updating points?
            error: function (data) {

                //$.alertify.error('error scoring points :(');

                //alert('Error un-loving track :(');  /// @todo: custom alert

                //$(".skip").html('loved');
            }*/
        });
    }

    function setOpenGraph(setValue) {
        console.log('setting open graph preference to '+setValue);

        requestData = {
            user : $.user._id,
            opengraph : setValue
        };

        console.log(requestData);

        $.ajax({
            type: 'POST',
            data: requestData,
            dataType : 'json',
            url: '/api:setopengraph',
            success: function (data) {

                $.user.opengraph = setValue;

                console.log(data);

            },
            error: function (data) {

                console.log(data);

            }
        });
    }

    function doOpenGraph(apiMethod) {

        if(apiMethod == 'video.watches') {
            openGraphRecipe = {
                video : document.URL
            };
            actionName = "watch";
        }
        if(apiMethod == 'eatbass:love') {
            openGraphRecipe = {
                other : document.URL
            };
            actionName = "love";
        }

        console.log(apiMethod);
        console.log(openGraphRecipe);

        // FB Open Graph Action
        FB.api('/me/'+apiMethod, 'post',
            openGraphRecipe,
            function(response) {
                console.log(response);
                if (!response || response.error) {
                    console.log('Open Graph error occured');
                    //fbJsLogin();
                    $('#fb-status').html('');
                } else {
                    console.log('response');
                    console.log('Action was successful! Action ID: ' + response.id);
                    $('#fb-status').html(actionName+' posted to facebook. <a href="#" data-actionid="'+response.id+'" class="delete_opengraph">delete</a>');

                    // Allow delete open graph
                    $(".delete_opengraph").click(function (e) {
                        e.preventDefault();

                        var actionId = $(".delete_opengraph").data('actionid');
                        deleteOpenGraph(actionId);
                    });
                }
            });
    }

    function deleteOpenGraph(actionId) {
        console.log('deleting open graph action '+actionId);

        FB.api(
          '/'+actionId,
          'delete',
          function(response) {
            console.log(response);
            $('#fb-status').html(actionName+' deleted from facebook.');
          }
        );
    }

    // Page stuff

    // Profile

    // hide with js if not profile
    //$("#profile").hide();

    function viewProfile() {
        console.log('loading profile');

        $("#profile").fadeToggle();
        $("#profile").spin("yt");

        requestData = {
            user : $.user._id
        };

        $.ajax({
            type: 'POST',
            data: requestData,
            //dataType : 'json',
            url: '/api:profilehtml',
            success: function (data) {

                // console.log(data);

                if(data === 'false') {
                    setTimeout(function () {
                        viewProfile();
                    }, 2000);
                    return;
                }

                $("#profile").spin(false);
                $("#profile_videos").html(data);
                /*

                data.forEach(function (videoId) {
                    console.log(videoId);

                    requestData = {
                        video : videoId
                    };

                    $.ajax({
                        type: 'POST',
                        data: requestData,
                        dataType : 'json',
                        url: '/api:video',
                        success: function (videoData) {

                            $("#profile_videos").append(videoData);
                        }
                    });
                });
                */
            },
            error: function (data) {

                $.alertify.error('error loading profile :(');

                $("#profile").fadeOut();
            }
        });
    }

    // Front end

    function runTour() {
        console.log('running tour');

        var tourdata = [
           {
              html: "Hello World"
           },{
              html: "Welcome to the Tour",
              live: 5000,
              delayIn: 500
           }
        ];
        var myTour = jTour(tourdata);
        myTour.start();
    }

    function makeLinksExternal() {
        // Make description links external
        $("#video_description a[href^='http://']").attr("target","_blank");
    }

    // Facebook

    function logResponse(response) {
        if (console && console.log) {
            console.log('The response was', response);
        }
    }

    // Set up so we handle click on the buttons
    $('.fb-js-login').click(function (e) {
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