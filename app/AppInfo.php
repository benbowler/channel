<?php

putenv("FACEBOOK_APP_ID=158294040998384");
putenv("FACEBOOK_SECRET=5f1f26bc4ef7ce99ecbc25fbf8d85eaa");

/**
 * This class provides static methods that return pieces of data specific to
 * your app
 */
class AppInfo {

  /*****************************************************************************
   *
   * These functions provide the unique identifiers that your app users.  These
   * have been pre-populated for you, but you may need to change them at some
   * point.  They are currently being stored in 'Environment Variables'.  To
   * learn more about these, visit
   *   'http://php.net/manual/en/function.getenv.php'
   *
   ****************************************************************************/

  /**
   * @return the appID for this app
   */
  public static function appID() {
    return getenv('PARAM1');
  }

  /**
   * @return the appSecret for this app
   */
  public static function appSecret() {
    return getenv('PARAM2');
  }

  /**
   * @return the url
   */
  public static function getUrl($path = '/') {
    if (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1)
      || isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https'
    ) {
      $protocol = 'https://';
    }
    else {
      $protocol = 'http://';
    }

    return $protocol . $_SERVER['HTTP_HOST'] . $path;
  }

}
