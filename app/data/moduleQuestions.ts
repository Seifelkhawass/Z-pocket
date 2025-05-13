export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface ModuleQuestions {
  [key: string]: Question[];
}

export const moduleQuestions: ModuleQuestions = {
  crypto: [
    {
      question: "What is the primary purpose of blockchain technology?",
      options: [
        "To create digital currencies only",
        "To provide a decentralized, secure, and transparent way to record transactions",
        "To replace traditional banking systems",
        "To enable anonymous transactions"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a smart contract?",
      options: [
        "A legal document for cryptocurrency transactions",
        "A self-executing contract with the terms written in code",
        "A type of cryptocurrency wallet",
        "A blockchain security feature"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the process of creating new bitcoins called?",
      options: [
        "Mining",
        "Trading",
        "Staking",
        "Hashing"
      ],
      correctAnswer: 0
    },
    {
      question: "What is a private key in cryptocurrency?",
      options: [
        "A password for your exchange account",
        "A secret number that allows you to spend your cryptocurrency",
        "A public address for receiving funds",
        "A backup phrase for your wallet"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the main difference between Bitcoin and Ethereum?",
      options: [
        "Bitcoin is more valuable than Ethereum",
        "Ethereum can run smart contracts while Bitcoin cannot",
        "Bitcoin is faster than Ethereum",
        "Ethereum is more secure than Bitcoin"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a blockchain fork?",
      options: [
        "A security vulnerability in the blockchain",
        "A split in the blockchain creating two separate chains",
        "A type of cryptocurrency wallet",
        "A blockchain backup system"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the purpose of a cryptocurrency wallet?",
      options: [
        "To store physical cryptocurrency",
        "To store private keys and interact with the blockchain",
        "To mine cryptocurrency",
        "To trade cryptocurrency"
      ],
      correctAnswer: 1
    },
    {
      question: "What is DeFi?",
      options: [
        "A type of cryptocurrency",
        "Decentralized Finance - financial services without intermediaries",
        "A blockchain security protocol",
        "A cryptocurrency exchange"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a token in cryptocurrency?",
      options: [
        "A physical representation of cryptocurrency",
        "A digital asset built on top of another blockchain",
        "A type of cryptocurrency wallet",
        "A blockchain security feature"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the purpose of consensus mechanisms in blockchain?",
      options: [
        "To increase transaction speed",
        "To ensure all nodes agree on the state of the blockchain",
        "To reduce transaction fees",
        "To increase privacy"
      ],
      correctAnswer: 1
    }
  ],
  eWallets: [
    {
      question: "What is the main purpose of a cryptocurrency wallet?",
      options: [
        "To store physical cryptocurrency",
        "To store private keys and interact with the blockchain",
        "To mine cryptocurrency",
        "To trade cryptocurrency"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the difference between a hot wallet and a cold wallet?",
      options: [
        "Hot wallets are more expensive than cold wallets",
        "Hot wallets are connected to the internet, cold wallets are not",
        "Cold wallets can only store Bitcoin",
        "Hot wallets are more secure than cold wallets"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a seed phrase?",
      options: [
        "A password for your wallet",
        "A list of words that can recover your wallet",
        "A type of cryptocurrency",
        "A security feature for transactions"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a hardware wallet?",
      options: [
        "A physical device that stores private keys offline",
        "A type of software wallet",
        "A wallet that only works with hardware",
        "A backup system for wallets"
      ],
      correctAnswer: 0
    },
    {
      question: "What is the purpose of a public address?",
      options: [
        "To store your private keys",
        "To receive cryptocurrency from others",
        "To mine cryptocurrency",
        "To trade cryptocurrency"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a multi-signature wallet?",
      options: [
        "A wallet that can hold multiple cryptocurrencies",
        "A wallet that requires multiple approvals for transactions",
        "A wallet that can be used by multiple people",
        "A wallet with multiple security features"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the main risk of using a hot wallet?",
      options: [
        "High transaction fees",
        "Vulnerability to online attacks",
        "Limited cryptocurrency support",
        "Slow transaction speeds"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a paper wallet?",
      options: [
        "A physical document containing wallet information",
        "A type of software wallet",
        "A wallet that only works with paper currency",
        "A backup system for hardware wallets"
      ],
      correctAnswer: 0
    },
    {
      question: "What is the purpose of wallet encryption?",
      options: [
        "To increase transaction speed",
        "To protect private keys with a password",
        "To reduce transaction fees",
        "To enable anonymous transactions"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a watch-only wallet?",
      options: [
        "A wallet that can only receive funds",
        "A wallet that can only send funds",
        "A wallet that can only view balances",
        "A wallet that can only trade"
      ],
      correctAnswer: 2
    }
  ],
  moneyEarning: [
    {
      question: "What is staking in cryptocurrency?",
      options: [
        "A type of mining",
        "Holding cryptocurrency to support network operations and earn rewards",
        "A trading strategy",
        "A security feature"
      ],
      correctAnswer: 1
    },
    {
      question: "What is yield farming?",
      options: [
        "A type of mining",
        "A way to earn rewards by providing liquidity to DeFi protocols",
        "A trading strategy",
        "A security feature"
      ],
      correctAnswer: 1
    },
    {
      question: "What is liquidity mining?",
      options: [
        "A type of cryptocurrency mining",
        "Providing liquidity to earn rewards and fees",
        "A trading strategy",
        "A security feature"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a liquidity pool?",
      options: [
        "A type of wallet",
        "A pool of tokens locked in a smart contract for trading",
        "A mining pool",
        "A security feature"
      ],
      correctAnswer: 1
    },
    {
      question: "What is impermanent loss?",
      options: [
        "A permanent loss of funds",
        "A temporary loss due to price changes in liquidity pools",
        "A trading fee",
        "A security risk"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a yield aggregator?",
      options: [
        "A type of wallet",
        "A platform that automatically moves funds between different yield opportunities",
        "A trading bot",
        "A security feature"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a flash loan?",
      options: [
        "A traditional bank loan",
        "A loan that must be borrowed and repaid in the same transaction",
        "A long-term loan",
        "A security feature"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a governance token?",
      options: [
        "A token used for voting on protocol changes",
        "A type of stablecoin",
        "A security token",
        "A utility token"
      ],
      correctAnswer: 0
    },
    {
      question: "What is a rebase token?",
      options: [
        "A token that automatically adjusts its supply",
        "A type of stablecoin",
        "A security token",
        "A utility token"
      ],
      correctAnswer: 0
    },
    {
      question: "What is a synthetic asset?",
      options: [
        "A physical asset",
        "A token that represents another asset's value",
        "A type of stablecoin",
        "A security token"
      ],
      correctAnswer: 1
    }
  ],
  investment: [
    {
      question: "What is a bull market?",
      options: [
        "A market where prices are falling",
        "A market where prices are rising",
        "A market that's stable",
        "A market that's volatile"
      ],
      correctAnswer: 1
    },
    {
      question: "What is diversification?",
      options: [
        "Investing all money in one asset",
        "Spreading investments across different assets",
        "A type of trading strategy",
        "A security feature"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a stop-loss order?",
      options: [
        "An order to buy at a specific price",
        "An order to sell when price falls to a specific level",
        "A type of market order",
        "A security feature"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a bear market?",
      options: [
        "A market where prices are rising",
        "A market where prices are falling",
        "A market that's stable",
        "A market that's volatile"
      ],
      correctAnswer: 1
    },
    {
      question: "What is dollar-cost averaging?",
      options: [
        "Investing a fixed amount at regular intervals",
        "Investing all money at once",
        "A type of trading strategy",
        "A security feature"
      ],
      correctAnswer: 0
    },
    {
      question: "What is a portfolio?",
      options: [
        "A single investment",
        "A collection of investments",
        "A type of trading strategy",
        "A security feature"
      ],
      correctAnswer: 1
    },
    {
      question: "What is risk tolerance?",
      options: [
        "The amount of money you can invest",
        "Your ability to handle investment losses",
        "A type of trading strategy",
        "A security feature"
      ],
      correctAnswer: 1
    },
    {
      question: "What is compound interest?",
      options: [
        "Interest earned only on the principal",
        "Interest earned on both principal and accumulated interest",
        "A type of trading strategy",
        "A security feature"
      ],
      correctAnswer: 1
    },
    {
      question: "What is a market cap?",
      options: [
        "The total value of all shares of a company",
        "The price of a single share",
        "A type of trading strategy",
        "A security feature"
      ],
      correctAnswer: 0
    },
    {
      question: "What is a dividend?",
      options: [
        "A type of loan",
        "A share of company profits paid to shareholders",
        "A type of trading strategy",
        "A security feature"
      ],
      correctAnswer: 1
    }
  ]
}; 