# Open Internet Summer 2024

Welcome to the Open Internet Summer (OIS) platform for registering participants and storing their submissions.

##

## Dev Instructions

# Initial setup

Install node, mops, dfx, docker.

- `npm install`
- `mops install`
- `cd docker && docker build . -t deps`

# Daily setup

- (new tab) `dfx start`
- (new tab) `cd docker && docker run -it deps`
- (previous tab) `npm run dev` or `dfx deploy`

## Credits

Created by [seb_icp](https://x.com/seb_icp/), and [Tiago89](https://github.com/tiagoicp) with love ❤️
