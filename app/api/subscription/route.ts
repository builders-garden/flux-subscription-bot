import { chainParser, FLUX_SUB_ABI, Subscription } from "@/app/lib/utils";
import { createPublicClient } from "viem";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { NextResponse } from 'next/server';
import { fluxSubscriptionAddresses } from '@/app/lib/addresses';

export const maxDuration = 300;


export async function GET(request: Request) {

  // check if the request is authorized. The request must have a header with the key 'authorization' and the value must be the cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  try {
    await checkAndTriggerSubscriptions();
    return NextResponse.json({ message: 'Subscriptions checked and triggered successfully' });
  } catch (error) {
    console.error('Error checking subscriptions:', error);
    return NextResponse.json({ error: 'An error occurred while checking subscriptions' }, { status: 500 });
  }

  async function checkAndTriggerSubscriptions() {
    // loop through all the addresses and check if the trigger time is less than the current time
    for (const { chainId, address } of fluxSubscriptionAddresses) {
      const chain = chainParser(chainId);
      const publicClient = createPublicClient({
        chain,
        transport: http(),
      });
      // get the last subscription id
      const lastSubscriptionId = await publicClient.readContract({
        address: address as `0x${string}`,
        abi: FLUX_SUB_ABI,
        functionName: 'lastSubscriptionId',
      }) as bigint;
      for (let i = 1; i <= lastSubscriptionId; i++) {
        const subscription = await publicClient.readContract({
            address: address as `0x${string}`,
            abi: FLUX_SUB_ABI,
            functionName: 'subscriptions',
            args: [BigInt(i)],
        }) as unknown as Subscription;

        const triggerTime = subscription.triggerTime;
        const active = subscription.active;
  
        const currentTime = Math.floor(Date.now() / 1000);

        // if the subscription is active and the trigger time is less than the current time, trigger the payment
        if (active && triggerTime <= currentTime) {
          await triggerPayment(chainId, address, i);
        }
      }
    }
  }
  // trigger the payment for a subscription
  async function triggerPayment(chainId: number, contractAddress: string, subscriptionId: number) {
    const chain = chainParser(chainId);
    const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
    const client = createWalletClient({
      account,
      chain,
      transport: http(),
    });
  
    await client.writeContract({
      address: contractAddress as `0x${string}`,
      abi: FLUX_SUB_ABI,
      functionName: 'triggerPayment',
      args: [BigInt(subscriptionId)],
    });
  }
  
}
