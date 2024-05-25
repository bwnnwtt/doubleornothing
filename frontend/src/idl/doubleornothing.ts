/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/doubleornothing.json`.
 */
export type Doubleornothing = {
  "address": "7BphZadCBnMT1duPMHzsE92sYeBp6myuTREceF3bajdf",
  "metadata": {
    "name": "doubleornothing",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "bet",
      "discriminator": [
        94,
        203,
        166,
        126,
        20,
        243,
        169,
        82
      ],
      "accounts": [
        {
          "name": "player",
          "writable": true,
          "signer": true
        },
        {
          "name": "treasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  82,
                  69,
                  65,
                  83,
                  85,
                  82,
                  89
                ]
              }
            ]
          }
        },
        {
          "name": "stats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  84,
                  65,
                  84,
                  83,
                  68,
                  65,
                  84,
                  65
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeAccounts",
      "discriminator": [
        171,
        222,
        94,
        233,
        34,
        250,
        202,
        1
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "treasury",
            "stats"
          ]
        },
        {
          "name": "treasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  82,
                  69,
                  65,
                  83,
                  85,
                  82,
                  89
                ]
              }
            ]
          }
        },
        {
          "name": "stats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  84,
                  65,
                  84,
                  83,
                  68,
                  65,
                  84,
                  65
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "initializer",
          "writable": true,
          "signer": true
        },
        {
          "name": "treasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  84,
                  82,
                  69,
                  65,
                  83,
                  85,
                  82,
                  89
                ]
              }
            ]
          }
        },
        {
          "name": "stats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  83,
                  84,
                  65,
                  84,
                  83,
                  68,
                  65,
                  84,
                  65
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "updateAuthorities",
      "discriminator": [
        175,
        228,
        137,
        18,
        175,
        70,
        220,
        165
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "treasury",
            "stats"
          ]
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "stats",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "newAuthority",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "stats",
      "discriminator": [
        190,
        125,
        51,
        63,
        169,
        197,
        36,
        238
      ]
    },
    {
      "name": "treasury",
      "discriminator": [
        238,
        239,
        123,
        238,
        89,
        1,
        168,
        253
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "betExceedsTreasury",
      "msg": "bet size exceeds the treasury threshold"
    },
    {
      "code": 6001,
      "name": "insufficientFunds",
      "msg": "insufficient funds"
    }
  ],
  "types": [
    {
      "name": "stats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "betCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "treasury",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
