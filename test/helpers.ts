import { ethers } from 'hardhat';
import { BigNumber, ContractFactory } from 'ethers';
import { KernelMock, Governance } from '../typechain';

enum ProposalState {
    WarmUp,
    ReadyForActivation,
    Active,
    Canceled,
    Failed,
    Accepted,
    Queued,
    Grace,
    Expired,
    Executed
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const tenPow18 = BigNumber.from(10).pow(18);

export async function deployKernel (): Promise<KernelMock> {
    const KernelMock: ContractFactory = await ethers.getContractFactory('KernelMock');
    const kernel: KernelMock = (await KernelMock.deploy()) as KernelMock;
    await kernel.deployed();

    return kernel;
}

export async function deployGovernance (): Promise<Governance> {
    const Governance: ContractFactory = await ethers.getContractFactory('Governance');
    const governance: Governance = (await Governance.deploy()) as Governance;
    await governance.deployed();

    return governance;
}

export async function getLatestBlock (): Promise<any> {
    return await ethers.provider.send('eth_getBlockByNumber', ['latest', false]);
}

export async function setNextBlockTimestamp (timestamp: number): Promise<void> {
    const block = await ethers.provider.send('eth_getBlockByNumber', ['latest', false]);
    const currentTs = parseInt(block.timestamp);
    const diff = timestamp - currentTs;
    await ethers.provider.send('evm_increaseTime', [diff]);
}

export async function moveAtTimestamp (timestamp: number): Promise<void> {
    await setNextBlockTimestamp(timestamp);
    await ethers.provider.send('evm_mine', []);
}

export async function getCurrentBlockchainTimestamp (): Promise<number> {
    const block = await getLatestBlock();
    return parseInt(block.timestamp);
}
