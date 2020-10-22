import { run, ethers } from '@nomiclabs/buidler';

import DegovArtifact from '../artifacts/Degov.json';
import GovernorAlphaArtifact from '../artifacts/GovernorAlpha.json';
import TimelockArtifact from '../artifacts/Timelock.json';
import DebasePolicyArtifact from '../artifacts/DebasePolicy.json';
import OrchestratorArtifact from '../artifacts/Orchestrator.json';
import StabilizerPoolArtifact from '../artifacts/StabilizerPool.json';

import { Degov } from '../type/Degov';
import { GovernorAlpha } from '../type/GovernorAlpha';
import { Timelock } from '../type/Timelock';
import { DebasePolicy } from '../type/DebasePolicy';
import { Orchestrator } from '../type/Orchestrator';
import { StabilizerPool } from '../type/StabilizerPool';
import { promises } from 'fs';

async function main() {
	const signer = await ethers.getSigners();

	try {
		let data = await promises.readFile('contracts.json', 'utf-8');
		let dataParse = JSON.parse(data.toString());

		const degov = ((await ethers.getContractAt(DegovArtifact.abi, dataParse['degov'], signer[0])) as any) as Degov;
		const governorAlpha = ((await ethers.getContractAt(
			GovernorAlphaArtifact.abi,
			dataParse['governorAlpha'],
			signer[0]
		)) as any) as GovernorAlpha;
		const timelock = ((await ethers.getContractAt(
			TimelockArtifact.abi,
			dataParse['timelock'],
			signer[0]
		)) as any) as Timelock;

		const debasePolicy = ((await ethers.getContractAt(
			DebasePolicyArtifact.abi,
			dataParse['debasePolicy'],
			signer[0]
		)) as any) as DebasePolicy;
		const orchestrator = ((await ethers.getContractAt(
			OrchestratorArtifact.abi,
			dataParse['orchestrator'],
			signer[0]
		)) as any) as Orchestrator;

		const debaseDaiLpStabilizerPool = ((await ethers.getContractAt(
			StabilizerPoolArtifact.abi,
			dataParse['debaseDaiLpStabilizerPool'],
			signer[0]
		)) as any) as StabilizerPool;

		let balance = (await signer[0].getBalance()).toString();
		console.log('Balance before transfer ownership', ethers.utils.formatEther(balance));

		// await timelock.transferOwnership(timelock.address);
		// await degov.transferOwnership(timelock.address);
		// await governorAlpha.transferOwnership(timelock.address);
		// await debasePolicy.transferOwnership(timelock.address);
		// await orchestrator.transferOwnership(timelock.address);
		// await debaseDaiLpStabilizerPool.transferOwnership(timelock.address);

		await orchestrator.rebase();
		// balance = (await signer[0].getBalance()).toString();
		// console.log('Balance after transfer ownership', ethers.utils.formatEther(balance));
	} catch (error) {
		console.log(error);
	}
}

main().then(() => process.exit(0)).catch((error) => {
	console.error(error);
	process.exit(1);
});
