import fs from 'fs';
import { IJob, ISkill } from './interfaces.js';
import * as config from './config.js';

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
	a {
		color: yellow;
	}
	li {
		margin-bottom: .5rem;
	}
</style>
<h1>REST/GraphQL Site</h1>
<h2>REST</h2>
<ul>
	<li><a href="http://localhost:${config.port}/jobs"><code>/jobs</code></a> - all jobs</li>
	<li><a href="http://localhost:${config.port}/jobs/2"><code>/jobs/2</code></a> - job with id 2</li>
	<li><a href="http://localhost:${config.port}/skills"><code>/skills</code></a> - all skills</li>
	<li><a href="http://localhost:${config.port}/skills/react"><code>/skills/react</code></a> - skill with id 2</li>
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

