# dialectlabs-actions
Forked from [@dialectlabs/actions](https://github.com/dialectlabs/actions).

This code is experimeantal purpose.

## Presets
Replace wallet in examples/donate/route.ts

```
const DONATION_DESTINATION_WALLET =
  'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg';
```

Please use Devnet network in your wallet settings.

## Starting Server
```
npm i
npm run dev
```

## Testing Blinks
### [/api/minimal-example](https://github.com/Superteam-Japan/dialectlabs-actions/blob/main/docs/minimal-example.png?raw=true)

![minimal example](https://github.com/256hax/dialectlabs-actions/blob/main/docs/minimal-example.png?raw=true)

### [/api/donate](https://github.com/Superteam-Japan/dialectlabs-actions/blob/main/docs/donate.png?raw=true)

![donate](https://github.com/256hax/dialectlabs-actions/blob/main/docs/donate.png?raw=true)

## How To

### Actions Development

1. See [Minimal Action example](examples/minimal-example/route.ts)
2. See [Donate Action example](examples/donate/route.ts)
3. Build your own action 
   * Use specified openapi `responses` from [openapi.ts](examples/openapi.ts) for your POST, GET methods
   * Use specified openapi `body` from [openapi.ts](examples/openapi.ts) for your POST methods
4. Add your router to [index.ts](examples/index.ts)

### Swagger UI
Open [http://localhost:3000/swagger-ui](http://localhost:3000/swagger-ui) with your browser to explore actions.

### Unfurl action into a Blink
To check and unfurl your or existing action open 

### Mainnet
[https://actions.dialect.to/](https://actions.dialect.to/)  
e.g action for swap on Jupiter: <localhost:3000/api/jupiter/swap/SOL-Bonk>

### Devnet
[https://dial.to/devnet/](https://dial.to/devnet/)  

## Learn More
To learn more about Hono, take a look at the following resources:

- [Hono Documentation](https://hono.dev/docs/) - learn about Hono features and API.
