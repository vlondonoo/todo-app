#% if (feature.ask) { %#
name = raw_input('What is your name?\n')
#% } else { %#
name = 'alex'
#% } %#

print 'Hi, %s.' % name
