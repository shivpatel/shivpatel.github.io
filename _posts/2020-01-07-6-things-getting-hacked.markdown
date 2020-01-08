---
layout: post
title:  "6 thing I learned about building web services and getting hacked"
date:   2020-01-07 22:30:00 -0500
categories: devops
---
I’ve spent countless years building websites, deploying APIs, and setting up infrastructure. Here are a few things I’ve learned when it comes to securing your apps:

<h1>1. If it isn’t simple, it won’t work.</h1>

Don’t let security overwhelm you or lead to laziness. Failure to update or maintain your security implementation can lead to unwanted exposure. Try starting with simple, manageable strategies like:

<ul>
    <li>IP whitelist/blacklist</li>
    <li>Encryption at rest</li>
    <li>Encryption in transit</li>
</ul>

If your security can’t be simplified, try to micro-service your development or find a service provider to help make it manageable.

<h1>2. Juggle responsibilities with caution.</h1>

Being curious and wanting more responsibility is great for your career! However, be cautious when you’ve unofficially taken on multiple engineering roles on your team (Mr. Full-stack DevOps Security Engineer). If you find yourself in this position, find a mentor and learn from those with more experience. Never be afraid to ask for help or hire additional resources when it gets out-of-hand.

<h1>3. Separation of concerns.</h1>

GitHub is a dedicated store for your code. Find the equivalent provider for your configs and secrets. Database password, API keys, session tokens/secrets, encryption keys, etc. don’t belong in your code. Try Meercall or HashiCorp Vault before building and maintaining your own solution. Reduce the security burden on your team, so they can focus on building the best products and services for your customers.

<h1>4. Change app-level passwords and keys.</h1>

Your employer probably requires you change your work password every 30–90 days. It’s a pain in the butt, but it’s there for a good reason. Do the same for your configurations. Change database password, API keys, and session secrets at an interval you can maintain.

<h1>5. Maintain and patch in a timely fashion.</h1>

If you’re running your own encryption vault, on-site database, password manager, or other DIY solution, make sure there’s dedicate time on your calendar to maintain, patch, upgrade on a generous interval. Don’t apply updates haphazardly; look through the changelog. Have certain things been deprecated? Are there new features that can make your security efforts more fruitful, while requiring less effort?

<h1>6. It will never be hacker proof.</h1>

It’s the truth. Don’t let anyone convince you otherwise. Instead of striving for hacker proof, strive for vigilance and consistency; you’ll be less likely to get caught off guard!

<h2>Conclusion</h2>

Be on your toes as you continue to build. You can’t win the security battle, but you can turn your experience and knowledge into a powerful tool and mindset to get ahead!