# Description
#   runs deployment scripts based on slack messages
#
# Commands:
#   hubot deploy dev - deploys api dev as root
#
# Author:
#   Josh Greenberger

exec = require('child_process').exec
deployScriptPath = '/home/hubot/DeploymentScripts/hubot'
authorizedSlackUsers = [
  'bong.koh',
  'CircleCI', 
  'brain.lai', 
  'dan.perron',
  'luke.wilimitis',
  'jacob.lee',
  'josh.gachnang',
  'josh.greenberger', 
  'sunjay.kumar',
]

module.exports = (robot) ->

  # Matcher at the end of the regex looks for the deploy tag.
  robot.respond /deploy dev ([\w-\.]+)$/i, (msg) ->
    return unless msg.message.user.name in authorizedSlackUsers
    deployTag = msg.match[1].toLowerCase()
    msg.send "Starting triggr_api dev continuous deploy."
    child = exec "sudo #{deployScriptPath}/dev.deploy_api.sh #{deployTag}", (error, stdout, stderr) ->
      if stderr
        robot.logger.error "Error: #{stderr}"
      if stdout
        robot.logger.info "Program output #{stdout}"
      process.exit()
