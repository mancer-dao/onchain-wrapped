## neynar https://api.neynar.com/v2/farcaster/feed/trending/

- Fetch trending casts or on the global feed or channels feeds. 7d time window available for channel feeds only.
- quite cheap call 8 credits
- max 7d history, wont work for yearly

```json
{
  "casts": [
    {
      "object": "cast",
      "hash": "<string>",
      "parent_hash": "<string>",
      "parent_url": "<string>",
      "root_parent_url": "<string>",
      "parent_author": {
        "fid": 3
      },
      "author": {
        "object": "user",
        "fid": 3,
        "username": "<string>",
        "display_name": "<string>",
        "custody_address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
        "pro": {
          "status": "subscribed",
          "subscribed_at": "2023-11-07T05:31:56Z",
          "expires_at": "2023-11-07T05:31:56Z"
        },
        "pfp_url": "<string>",
        "profile": {
          "bio": {},
          "location": {},
          "banner": {}
        },
        "follower_count": 123,
        "following_count": 123,
        "verifications": [
          "0x5a927ac639636e534b678e81768ca19e2c6280b7"
        ],
        "auth_addresses": [
          {}
        ],
        "verified_addresses": {
          "eth_addresses": [
            "<any>"
          ],
          "sol_addresses": [
            "<any>"
          ],
          "primary": {}
        },
        "verified_accounts": [
          {}
        ],
        "experimental": {
          "deprecation_notice": "<string>",
          "neynar_user_score": 123
        },
        "viewer_context": {
          "following": true,
          "followed_by": true,
          "blocking": true,
          "blocked_by": true
        },
        "score": 123
      },
      "app": {
        "object": "user_dehydrated",
        "fid": 3,
        "username": "<string>",
        "display_name": "<string>",
        "pfp_url": "<string>",
        "custody_address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
        "score": 123
      },
      "text": "<string>",
      "timestamp": "2023-11-07T05:31:56Z",
      "embeds": [
        {
          "cast_id": {
            "fid": 3,
            "hash": "<string>"
          },
          "cast": {
            "hash": "<string>",
            "parent_hash": "<string>",
            "parent_url": "<string>",
            "root_parent_url": "<string>",
            "parent_author": {
              "fid": 3
            },
            "author": {
              "object": "<any>",
              "fid": "<any>",
              "username": "<any>",
              "display_name": "<any>",
              "pfp_url": "<any>",
              "custody_address": "<any>",
              "score": "<any>"
            },
            "app": {
              "object": "user_dehydrated",
              "fid": 3,
              "username": "<string>",
              "display_name": "<string>",
              "pfp_url": "<string>",
              "custody_address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
              "score": 123
            },
            "text": "<string>",
            "timestamp": "2023-11-07T05:31:56Z",
            "embeds": [
              {
                "cast_id": {
                  "fid": 3,
                  "hash": "<string>"
                },
                "cast": {
                  "object": "cast_dehydrated",
                  "hash": "<string>",
                  "author": {},
                  "app": "<any>"
                }
              }
            ],
            "channel": {
              "id": "<string>",
              "name": "<string>",
              "object": "channel_dehydrated",
              "image_url": "<string>",
              "viewer_context": {
                "following": "<any>",
                "role": "<any>"
              }
            }
          }
        }
      ],
      "type": "cast-mention",
      "reactions": {
        "likes": [
          {
            "fid": 3,
            "fname": "<string>"
          }
        ],
        "recasts": [
          {
            "fid": 3,
            "fname": "<string>"
          }
        ],
        "likes_count": 123,
        "recasts_count": 123
      },
      "replies": {
        "count": 123
      },
      "thread_hash": "<string>",
      "mentioned_profiles": [
        {
          "object": "user",
          "fid": 3,
          "username": "<string>",
          "display_name": "<string>",
          "custody_address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
          "pro": {
            "status": "subscribed",
            "subscribed_at": "2023-11-07T05:31:56Z",
            "expires_at": "2023-11-07T05:31:56Z"
          },
          "pfp_url": "<string>",
          "profile": {
            "bio": {},
            "location": {},
            "banner": {}
          },
          "follower_count": 123,
          "following_count": 123,
          "verifications": [
            "0x5a927ac639636e534b678e81768ca19e2c6280b7"
          ],
          "auth_addresses": [
            {}
          ],
          "verified_addresses": {
            "eth_addresses": [
              "<any>"
            ],
            "sol_addresses": [
              "<any>"
            ],
            "primary": {}
          },
          "verified_accounts": [
            {}
          ],
          "experimental": {
            "deprecation_notice": "<string>",
            "neynar_user_score": 123
          },
          "viewer_context": {
            "following": true,
            "followed_by": true,
            "blocking": true,
            "blocked_by": true
          },
          "score": 123
        }
      ],
      "mentioned_profiles_ranges": [
        {
          "start": 1,
          "end": 1
        }
      ],
      "mentioned_channels": [
        {
          "id": "<string>",
          "name": "<string>",
          "object": "channel_dehydrated",
          "image_url": "<string>",
          "viewer_context": {
            "following": "<any>",
            "role": "<any>"
          }
        }
      ],
      "mentioned_channels_ranges": [
        {
          "start": 1,
          "end": 1
        }
      ],
      "channel": {
        "id": "<string>",
        "url": "<string>",
        "name": "<string>",
        "description": "<string>",
        "object": "channel",
        "created_at": "2023-11-07T05:31:56Z",
        "follower_count": 123,
        "external_link": {
          "title": "<string>",
          "url": "<string>"
        },
        "image_url": "<string>",
        "parent_url": "<string>",
        "lead": {
          "object": "user",
          "fid": 3,
          "username": "<string>",
          "display_name": "<string>",
          "custody_address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
          "pro": {
            "status": "subscribed",
            "subscribed_at": "2023-11-07T05:31:56Z",
            "expires_at": "2023-11-07T05:31:56Z"
          },
          "pfp_url": "<string>",
          "profile": {
            "bio": {},
            "location": {},
            "banner": {}
          },
          "follower_count": 123,
          "following_count": 123,
          "verifications": [
            "0x5a927ac639636e534b678e81768ca19e2c6280b7"
          ],
          "auth_addresses": [
            {}
          ],
          "verified_addresses": {
            "eth_addresses": [
              "<any>"
            ],
            "sol_addresses": [
              "<any>"
            ],
            "primary": {}
          },
          "verified_accounts": [
            {}
          ],
          "experimental": {
            "deprecation_notice": "<string>",
            "neynar_user_score": 123
          },
          "viewer_context": {
            "following": true,
            "followed_by": true,
            "blocking": true,
            "blocked_by": true
          },
          "score": 123
        },
        "moderator_fids": [
          3
        ],
        "member_count": 123,
        "moderator": {
          "object": "user",
          "fid": 3,
          "username": "<string>",
          "display_name": "<string>",
          "custody_address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
          "pro": {
            "status": "subscribed",
            "subscribed_at": "2023-11-07T05:31:56Z",
            "expires_at": "2023-11-07T05:31:56Z"
          },
          "pfp_url": "<string>",
          "profile": {
            "bio": {},
            "location": {},
            "banner": {}
          },
          "follower_count": 123,
          "following_count": 123,
          "verifications": [
            "0x5a927ac639636e534b678e81768ca19e2c6280b7"
          ],
          "auth_addresses": [
            {}
          ],
          "verified_addresses": {
            "eth_addresses": [
              "<any>"
            ],
            "sol_addresses": [
              "<any>"
            ],
            "primary": {}
          },
          "verified_accounts": [
            {}
          ],
          "experimental": {
            "deprecation_notice": "<string>",
            "neynar_user_score": 123
          },
          "viewer_context": {
            "following": true,
            "followed_by": true,
            "blocking": true,
            "blocked_by": true
          },
          "score": 123
        },
        "pinned_cast_hash": "0x71d5225f77e0164388b1d4c120825f3a2c1f131c",
        "hosts": [
          {
            "object": "user",
            "fid": 3,
            "username": "<string>",
            "display_name": "<string>",
            "custody_address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
            "pro": {
              "status": "subscribed",
              "subscribed_at": "2023-11-07T05:31:56Z",
              "expires_at": "2023-11-07T05:31:56Z"
            },
            "pfp_url": "<string>",
            "profile": {
              "bio": {},
              "location": {},
              "banner": {}
            },
            "follower_count": 123,
            "following_count": 123,
            "verifications": [
              "0x5a927ac639636e534b678e81768ca19e2c6280b7"
            ],
            "auth_addresses": [
              {}
            ],
            "verified_addresses": {
              "eth_addresses": [
                "<any>"
              ],
              "sol_addresses": [
                "<any>"
              ],
              "primary": {}
            },
            "verified_accounts": [
              {}
            ],
            "experimental": {
              "deprecation_notice": "<string>",
              "neynar_user_score": 123
            },
            "viewer_context": {
              "following": true,
              "followed_by": true,
              "blocking": true,
              "blocked_by": true
            },
            "score": 123
          }
        ],
        "viewer_context": {
          "following": "<any>",
          "role": "<any>"
        },
        "description_mentioned_profiles": [
          {
            "object": "<any>",
            "fid": "<any>",
            "username": "<any>",
            "display_name": "<any>",
            "pfp_url": "<any>",
            "custody_address": "<any>",
            "score": "<any>"
          }
        ],
        "description_mentioned_profiles_ranges": [
          {
            "start": 1,
            "end": 1
          }
        ]
      },
      "viewer_context": {
        "liked": true,
        "recasted": true
      },
      "author_channel_context": {
        "following": "<any>",
        "role": "<any>"
      }
    }
  ],
  "next": {
    "cursor": "<string>"
  }
}
```

## neynar https://api.neynar.com/v2/farcaster/fungible/trending/

- get list of trending fungibles
- no docs on credit cost :thinking:

```json
{
  "trending": [
    {
      "object": "trending_fungible",
      "fungible": {
        "object": "fungible",
        "network": "ethereum",
        "name": "<string>",
        "symbol": "<string>",
        "address": "<string>",
        "decimals": 123,
        "total_supply": "<string>",
        "logo": "<string>",
        "price": {
          "in_usd": "<string>"
        }
      }
    }
  ]
}
```

## neynar https://api.neynar.com/v2/farcaster/fungible/trades/

- get recent trades for a specific fungible within a timeframe. Returns trades ordered by timestamp (most recent first).
- time frame 7d max
- no credit cost mentioned

```json
{
  "object": "fungible_trades",
  "trades": [
    {
      "object": "trade",
      "trader": {
        "object": "user_dehydrated",
        "fid": 3,
        "username": "<string>",
        "display_name": "<string>",
        "pfp_url": "<string>",
        "custody_address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
        "score": 123
      },
      "pool": {
        "object": "pool",
        "address": "<string>",
        "protocol_family": "<string>",
        "protocol_version": "<string>"
      },
      "transaction": {
        "hash": "<string>",
        "network": {
          "object": "network",
          "name": "<string>"
        },
        "net_transfer": {
          "object": "net_transfer",
          "receiving_fungible": {
            "object": "fungible_balance",
            "token": {
              "object": "fungible",
              "network": "ethereum",
              "name": "<string>",
              "symbol": "<string>",
              "address": "<string>",
              "decimals": 123,
              "total_supply": "<string>",
              "logo": "<string>"
            },
            "balance": {
              "in_usd": 123,
              "in_token": "<string>"
            }
          },
          "sending_fungible": {
            "object": "fungible_balance",
            "token": {
              "object": "fungible",
              "network": "ethereum",
              "name": "<string>",
              "symbol": "<string>",
              "address": "<string>",
              "decimals": 123,
              "total_supply": "<string>",
              "logo": "<string>"
            },
            "balance": {
              "in_usd": 123,
              "in_token": "<string>"
            }
          }
        }
      }
    }
  ]
}
```

## neynar https://api.neynar.com/v2/farcaster/channel/trending/

- Returns a list of trending channels based on activity

```json
{
  "channels": [
    {
      "object": "channel_activity",
      "cast_count_1d": "<string>",
      "cast_count_7d": "<string>",
      "cast_count_30d": "<string>",
      "channel": {
        "id": "<string>",
        "url": "<string>",
        "name": "<string>",
        "description": "<string>",
        "object": "channel",
        "created_at": "2023-11-07T05:31:56Z",
        "follower_count": 123,
        "external_link": {
          "title": "<string>",
          "url": "<string>"
        },
        "image_url": "<string>",
        "parent_url": "<string>",
        "lead": {
          "object": "user",
          "fid": 3,
          "username": "<string>",
          "display_name": "<string>",
          "custody_address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
          "pro": {
            "status": "subscribed",
            "subscribed_at": "2023-11-07T05:31:56Z",
            "expires_at": "2023-11-07T05:31:56Z"
          },
          "pfp_url": "<string>",
          "profile": {
            "bio": {
              "text": "<string>",
              "mentioned_profiles": [
                "<any>"
              ],
              "mentioned_profiles_ranges": [
                "<any>"
              ],
              "mentioned_channels": [
                "<any>"
              ],
              "mentioned_channels_ranges": [
                "<any>"
              ]
            },
            "location": {
              "latitude": 0,
              "longitude": 0,
              "address": {},
              "radius": 1
            },
            "banner": {
              "url": "<string>"
            }
          },
          "follower_count": 123,
          "following_count": 123,
          "verifications": [
            "0x5a927ac639636e534b678e81768ca19e2c6280b7"
          ],
          "auth_addresses": [
            {
              "address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
              "app": {}
            }
          ],
          "verified_addresses": {
            "eth_addresses": [
              "0x5a927ac639636e534b678e81768ca19e2c6280b7"
            ],
            "sol_addresses": [
              "<string>"
            ],
            "primary": {
              "eth_address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
              "sol_address": "<string>"
            }
          },
          "verified_accounts": [
            {
              "platform": "x",
              "username": "<string>"
            }
          ],
          "experimental": {
            "deprecation_notice": "<string>",
            "neynar_user_score": 123
          },
          "viewer_context": {
            "following": true,
            "followed_by": true,
            "blocking": true,
            "blocked_by": true
          },
          "score": 123
        },
        "moderator_fids": [
          3
        ],
        "member_count": 123,
        "moderator": {
          "object": "user",
          "fid": 3,
          "username": "<string>",
          "display_name": "<string>",
          "custody_address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
          "pro": {
            "status": "subscribed",
            "subscribed_at": "2023-11-07T05:31:56Z",
            "expires_at": "2023-11-07T05:31:56Z"
          },
          "pfp_url": "<string>",
          "profile": {
            "bio": {
              "text": "<string>",
              "mentioned_profiles": [
                "<any>"
              ],
              "mentioned_profiles_ranges": [
                "<any>"
              ],
              "mentioned_channels": [
                "<any>"
              ],
              "mentioned_channels_ranges": [
                "<any>"
              ]
            },
            "location": {
              "latitude": 0,
              "longitude": 0,
              "address": {},
              "radius": 1
            },
            "banner": {
              "url": "<string>"
            }
          },
          "follower_count": 123,
          "following_count": 123,
          "verifications": [
            "0x5a927ac639636e534b678e81768ca19e2c6280b7"
          ],
          "auth_addresses": [
            {
              "address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
              "app": {}
            }
          ],
          "verified_addresses": {
            "eth_addresses": [
              "0x5a927ac639636e534b678e81768ca19e2c6280b7"
            ],
            "sol_addresses": [
              "<string>"
            ],
            "primary": {
              "eth_address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
              "sol_address": "<string>"
            }
          },
          "verified_accounts": [
            {
              "platform": "x",
              "username": "<string>"
            }
          ],
          "experimental": {
            "deprecation_notice": "<string>",
            "neynar_user_score": 123
          },
          "viewer_context": {
            "following": true,
            "followed_by": true,
            "blocking": true,
            "blocked_by": true
          },
          "score": 123
        },
        "pinned_cast_hash": "0x71d5225f77e0164388b1d4c120825f3a2c1f131c",
        "hosts": [
          {
            "object": "user",
            "fid": 3,
            "username": "<string>",
            "display_name": "<string>",
            "custody_address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
            "pro": {
              "status": "subscribed",
              "subscribed_at": "2023-11-07T05:31:56Z",
              "expires_at": "2023-11-07T05:31:56Z"
            },
            "pfp_url": "<string>",
            "profile": {
              "bio": {
                "text": "<string>",
                "mentioned_profiles": [
                  "<any>"
                ],
                "mentioned_profiles_ranges": [
                  "<any>"
                ],
                "mentioned_channels": [
                  "<any>"
                ],
                "mentioned_channels_ranges": [
                  "<any>"
                ]
              },
              "location": {
                "latitude": 0,
                "longitude": 0,
                "address": {},
                "radius": 1
              },
              "banner": {
                "url": "<string>"
              }
            },
            "follower_count": 123,
            "following_count": 123,
            "verifications": [
              "0x5a927ac639636e534b678e81768ca19e2c6280b7"
            ],
            "auth_addresses": [
              {
                "address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
                "app": {}
              }
            ],
            "verified_addresses": {
              "eth_addresses": [
                "0x5a927ac639636e534b678e81768ca19e2c6280b7"
              ],
              "sol_addresses": [
                "<string>"
              ],
              "primary": {
                "eth_address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
                "sol_address": "<string>"
              }
            },
            "verified_accounts": [
              {
                "platform": "x",
                "username": "<string>"
              }
            ],
            "experimental": {
              "deprecation_notice": "<string>",
              "neynar_user_score": 123
            },
            "viewer_context": {
              "following": true,
              "followed_by": true,
              "blocking": true,
              "blocked_by": true
            },
            "score": 123
          }
        ],
        "viewer_context": {
          "following": true,
          "role": "member"
        },
        "description_mentioned_profiles": [
          {
            "object": "user_dehydrated",
            "fid": 3,
            "username": "<string>",
            "display_name": "<string>",
            "pfp_url": "<string>",
            "custody_address": "0x5a927ac639636e534b678e81768ca19e2c6280b7",
            "score": 123
          }
        ],
        "description_mentioned_profiles_ranges": [
          {
            "start": 1,
            "end": 1
          }
        ]
      }
    }
  ],
  "next": {
    "cursor": "<string>"
  }
}
```

## use neynar API to track interactions with specific accounts on farcaster

- partner with some accounts and/or use some popular accounts and track how other users interact popular/partner accounts display rankings in terms of interactions with popular/partner accounts
- TODO see if neynar API allows to implement it
- TODO see if we can get historic data for the whole year of 2025



