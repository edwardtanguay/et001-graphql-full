import fs from 'fs';
import { IJob, ISkill } from './interfaces.js';

const jobs: IJob[] = JSON.parse(fs.readFileSync('./src/data/jobs.json', 'utf8'));
const skills: ISkill[] = JSON.parse(fs.readFileSync('./src/data/skills.json', 'utf8'));

export const getApiInstructions = () => {
	return `
<style>
	body {
		background-color: #444;
		padding: 1rem;
		color: #fff;
		font-family: courier;
	}
	code {
		background-color: #333;
	}
</style>
<h1>Book Site API</h1>
<ul>
	<li><code>/books</code> - all books</li>
	<li><code>/books/3</code> - book with id 3</li>
</ul>
	`;
}

export const getJobs = (): IJob[] => {
	return jobs;
}

export const getJob = (id: number): IJob => {
	return jobs.find(m => m.id === id);
}

export const getSkills = (): ISkill[] => {
	return skills;
}

export const getSkill = (idCode: string): ISkill => {
	return skills.find(m => m.idCode === idCode);
}

