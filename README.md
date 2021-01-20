# Attend webex meetings automatically

## Instructions
1. Clone the repo.
2. Move the index.html and main.js to http server root.
3. Get a webex token from the webex developer website.
4. Create a profile named "headless" in firefox(or whatever, make corresponding change in the
   script).
5. Create cronjobs to launch the webex-join.sh script. The script takes
   a single argument, which is a url. The format of the url is
   "http://localhost/?token=<token>&meeting_url=<meeting url>"
6. You should also setup a cronjob to kill the browser when the meeting is
   over otherwise new firefox refuses to open new instances with the same
   profile.(eg: ps aux | grep "firefox -P headless" | awk 'NR==1{print $2}' | xargs kill)
