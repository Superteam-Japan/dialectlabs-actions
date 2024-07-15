import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  VersionedTransaction,
} from '@solana/web3.js';
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import {
  actionSpecOpenApiPostRequestBody,
  actionsSpecOpenApiGetResponse,
  actionsSpecOpenApiPostResponse,
} from '../openapi';
import { prepareTransaction } from '../../shared/transaction-utils';
import { ActionGetResponse, ActionPostRequest, ActionPostResponse } from '@solana/actions';

const DONATION_DESTINATION_WALLET =
  'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg';
const DONATION_AMOUNT_SOL = 0.0001;

const app = new OpenAPIHono();

app.openapi(
  createRoute({
    method: 'get',
    path: '/',
    tags: ['MinimalExample'],
    responses: actionsSpecOpenApiGetResponse,
  }),
  (c) => {
    const { icon, title, description } = getMetadata();
    const response: ActionGetResponse = {
      icon,
      label: `${DONATION_AMOUNT_SOL} SOL`,
      title,
      description,
      links: {
        actions: [
          ({
            label: `${DONATION_AMOUNT_SOL} SOL`,
            href: `/api/minimal-example/${DONATION_AMOUNT_SOL}`,
          }),
        ],
      },
    };

    console.log("response => %o", response)

    return c.json(response, 200);
  },
);
/*
response => {
  icon: 'https://fastly.picsum.photos/id/859/800/800.jpg?hmac=JccY8q4fczSKugjJr2mZvjhqsTd4vsqTfQfHwKE1k5Y',
  label: '0.0001 SOL',
  title: 'Minimal Example',
  description: 'This is minimal example for developers.',
  links: {
    actions: [
      { label: '0.0001 SOL', href: '/api/minimal-example/0.0001' },
      [length]: 1
    ]
  }
}
*/

app.openapi(
  createRoute({
    method: 'post',
    path: '/{amount}',
    tags: ['MinimalExample'],
    request: {
      params: z.object({
        amount: z
          .string()
          .optional()
          .openapi({
            param: {
              name: 'amount',
              in: 'path',
              required: false,
            },
            type: 'number',
            example: '1',
          }),
      }),
      body: actionSpecOpenApiPostRequestBody,
    },
    responses: actionsSpecOpenApiPostResponse,
  }),
  async (c) => {
    const amount = c.req.param('amount');
    const { account } = (await c.req.json()) as ActionPostRequest;

    const parsedAmount = parseFloat(amount);
    const transaction = await prepareMyTransaction(
      new PublicKey(account),
      new PublicKey(DONATION_DESTINATION_WALLET),
      parsedAmount * LAMPORTS_PER_SOL,
    );
    const response: ActionPostResponse = {
      transaction: Buffer.from(transaction.serialize()).toString('base64'),
    };

    console.log('account =>', account)
    console.log('DONATION_DESTINATION_WALLET =>', DONATION_DESTINATION_WALLET)
    console.log('transation =>', transaction)
    console.log("response => %o", response)

    return c.json(response, 200);
  },
);
/*
account => 55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK
DONATION_DESTINATION_WALLET => HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg
transation => VersionedTransaction {
  signatures: [
    Uint8Array(64) [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0
    ]
  ],
  message: MessageV0 {
    header: {
      numRequiredSignatures: 1,
      numReadonlySignedAccounts: 0,
      numReadonlyUnsignedAccounts: 1
    },
    staticAccountKeys: [
      [PublicKey [PublicKey(55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK)]],
      [PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)]],
      [PublicKey [PublicKey(11111111111111111111111111111111)]]
    ],
    recentBlockhash: 'H2Ki95WcbyaW7ogzTamDfH74tgrDXNN22DutMjqqe4j5',
    compiledInstructions: [ [Object] ],
    addressTableLookups: []
  }
}
response => {
  transaction: 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAQABAzyAARk1a4RUvpcb/FKI4TmPpdC7CzOxW+IJoT9QtNI49aRKbzaDlhFxHwQUn1HdQG3UvFLLhvIN0rEWCKYsfukAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO4Rue7fkUAJzRRgKQ3CGFu0UBAi8hxHstTVG6RDA5U8AQICAAEMAgAAAKCGAQAAAAAAAA=='
}
*/

function getMetadata(): Pick<
  ActionGetResponse,
  'icon' | 'title' | 'description'
> {
  const icon =
    'https://fastly.picsum.photos/id/859/800/800.jpg?hmac=JccY8q4fczSKugjJr2mZvjhqsTd4vsqTfQfHwKE1k5Y';
  const title = 'Minimal Example';
  const description =
    'This is minimal example for developers.';
  return { icon, title, description };
}
async function prepareMyTransaction(
  sender: PublicKey,
  recipient: PublicKey,
  lamports: number,
): Promise<VersionedTransaction> {
  const payer = new PublicKey(sender);
  const instructions = [
    SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: new PublicKey(recipient),
      lamports: lamports,
    }),
  ];

  console.log("instructions => %o", instructions)

  return prepareTransaction(instructions, payer);
}
/*
instructions => [
  TransactionInstruction {
    keys: [
      {
        pubkey: PublicKey [PublicKey(55AfqEL3TC9mpkDZ63UCgDrzPcMQd5aZtDegfQCWQ5tK)] {
          _bn: <BN: 3c800119356b8454be971bfc5288e1398fa5d0bb0b33b15be209a13f50b4d238>,
          [Symbol(Symbol.toStringTag)]: [Getter]
        },
        isSigner: true,
        isWritable: true
      },
      {
        pubkey: PublicKey [PublicKey(HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg)] {
          _bn: <BN: f5a44a6f36839611711f04149f51dd406dd4bc52cb86f20dd2b11608a62c7ee9>,
          [Symbol(Symbol.toStringTag)]: [Getter]
        },
        isSigner: false,
        isWritable: true
      },
      [length]: 2
    ],
    programId: PublicKey [PublicKey(11111111111111111111111111111111)] {
      _bn: <BN: 0>,
      [Symbol(Symbol.toStringTag)]: [Getter]
    },
    data: <Buffer 02 00 00 00 a0 86 01 00 00 00 00 00>
  },
  [length]: 1
]
*/

export default app;
