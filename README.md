# Keizi
Keizi is a work in progress federated aggregated forums platform, allowing you to host your decentralized aggregated forums, free from overarching administration, constantly changing policies, or unfair moderation.
It is build to be a base level API compatible with a user-designed (or downloaded) front end, and can communicate between servers seamlessly.

# API Routing
All routing related to communities have 3 common API paths:
`/`
`/:id`
`/create`

These routes allow the client to interact with the server in various ways, the current implemented routes are:
`/communities/`
`/communities/:id/posts`
`/communities/:id/posts/:id/comments`

Which can all be interacted with using the above paths.
These individual routes may have unique paths within them so please refer to the API documentation when designing your front end.

# Security
Communication between platforms requires an entirely unique authentication strategy, and so the nonce has been designed.
Before making any request outside of the platform, you must invoke `/auth/nonce` with a valid session token and target site.

This token can only be used once, and only on the site it was created for.
This token can then be safely passed to the target site using this format: `username@domain:nonce`.

Upon validation by the server, this token can no longer used.