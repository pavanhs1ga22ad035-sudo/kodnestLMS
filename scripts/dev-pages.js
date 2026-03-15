const pages = {
  '/': '<html><body style="font-family:sans-serif;padding:20px"><h1>KodNest Dev Preview</h1><p>Open <a href="/home">/home</a>, <a href="/courses">/courses</a>, <a href="/practice">/practice</a>, <a href="/community">/community</a>, <a href="/placements">/placements</a>, <a href="/compiler">/compiler</a>, <a href="/resume/create">/resume/create</a>, <a href="/brokod">/brokod</a>, or a course player route like <a href="/my-learning/class/demo">/my-learning/class/demo</a>.</p></body></html>',
  '/home': '<!doctype html><html><body style="font-family:sans-serif;padding:20px;background:#f3f4f6"><h1>Home Dashboard</h1><p>Hero + Live Sessions + Courses + Placement Achievements preview.</p></body></html>',
  '/courses': '<!doctype html><html><body style="font-family:sans-serif;padding:20px;background:#f3f4f6"><h1>Courses</h1><p>Courses listing preview.</p></body></html>',
  '/practice': '<!doctype html><html><body style="font-family:sans-serif;padding:20px;background:#f3f4f6"><h1>Practice</h1><p>Practice workspace preview.</p></body></html>',
  '/community': '<!doctype html><html><body style="font-family:sans-serif;padding:20px;background:#f3f4f6"><h1>Community</h1><p>Community feed preview.</p></body></html>',
  '/brokod': '<!doctype html><html><body style="font-family:sans-serif;padding:20px;background:#f3f4f6"><h1>BroKod</h1><p>AI assistant page preview.</p></body></html>',
  '/placements': '<!doctype html><html><body style="font-family:sans-serif;padding:20px;background:#f3f4f6"><h1>Placements Job Board</h1><p>Job cards with drawer preview.</p></body></html>',
  '/compiler': '<!doctype html><html><body style="font-family:sans-serif;padding:20px;background:#f3f4f6"><h1>Code Compiler</h1><p>Split editor + output terminal with language selector preview.</p></body></html>',
  '/resume/create': '<!doctype html><html><body style="font-family:sans-serif;padding:20px;background:#f3f4f6"><h1>Resume Generator</h1><p>Multi-step form + real-time PDF-style preview.</p></body></html>',
};

module.exports = {
  pages,
};
