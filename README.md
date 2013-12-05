# manta-skitch-proxy

This is a super-simple proxy for pointing the old Skitch software at Manta, so
that skitches show up in Manta.  It was written hastily -- use at your own risk.
There's absolutely no security on this server.  I run it on my Macbook, and it
only listens on localhost.

This only works (well) if you're willing to have your skitches be totally
public.  You can actually use it with a private directory, but Skitch won't be
able to construct a URL that you can copy to your clipboard.

To use this, first [set up the Manta
CLI](http://apidocs.joyent.com/manta/index.html), pick a directory where you
want your skitches to go, and create the directory.  I use `/dap/public/drop`:

    $ mmkdir /dap/public/drop

Now clone this repo and install it:

    $ git clone https://github.com/davepacheco/manta-skitch-proxy
    ...
    $ cd manta-skitch-proxy
    $ npm install

Now run the proxy with the same environment variables you use for the Manta
CLI, and give the proxy the base directory you want to use:

    $ export MANTA_USER=...
    $ export MANTA_URL=...
    $ export MANTA_KEY_ID=...
    $ node skitch-proxy.js /dap/public/drop | bunyan
    [2013-12-05T01:02:15.153Z]  INFO: skitch-proxy/15755 on sharptooth.local: listening at http://0.0.0.0:9050

Finally, configure skitch:

1. Open Skitch, then open Skitch -&gt; Preferences.
2. Select the "Share" tab.
3. Create a new account of type "WebDAV".  I called mine "manta".
4. Use these parameters:
    * Server: `localhost` (machine where you ran skitch-proxy)
    * Port: `9050` (hardcoded in skitch-proxy)
    * User, Password: leave blank
    * Directory: `/`
    * Base URL: `http://us-east.manta.joyent.com/PATH`, where PATH is the path
      you chose above (e.g., /dap/public/drop)
