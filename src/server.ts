import * as model from './model.js';
import express from 'express';
import cors from 'cors';
import * as config from './config.js';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

const jobs = model.getJobs();

const JobType = new GraphQLObjectType({
	name: "Job",
	fields: () => ({
		id: { type: GraphQLInt },
		title: { type: GraphQLString },
		company: { type: GraphQLString },
		url: { type: GraphQLString },
		description: { type: GraphQLString },
		skillList: { type: GraphQLString },
		publicationDate: { type: GraphQLString },
	})
})

const rootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		jobs: {
			type: new GraphQLList(JobType),
			args: {
				titleContains: { type: GraphQLString }
			},
			resolve(parent, args) {
				return jobs.filter(
					(job) =>
						!args.titleContains || job.title.toLowerCase().includes(args.titleContains.toLowerCase())
				);
			}
		}
	}
});

const mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		createJob: {
			type: JobType,
			args: {
				title: { type: GraphQLString },
				company: { type: GraphQLString },
				url: { type: GraphQLString }
			},
			resolve(parent, args) {
				const newJob = {
					id: jobs.length + 1,
					title: args.title,
					company: args.company,
					url: args.url,
					description: '',
					skillList: '',
					publicationDate: '',
				};
				jobs.push(newJob);
				return args;
			}
		}
	}
})

const schema = new GraphQLSchema({ query: rootQuery, mutation });


const app = express();
app.use(cors());

// GRAPHQL

const root = {
	message: () => {
		return 'this is the message';
	},
	departments: [
		"Sales",
		"Marketing",
		"Executive",
		"Development"
	],
	jobs: model.getJobs(),
	skills: model.getSkills()
};

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		rootValue: root,
		graphiql: true,
	})
);


// REST

app.get('/', (req: express.Request, res: express.Response) => {
	res.send(model.getApiInstructions());
});

app.get('/jobs', (req: express.Request, res: express.Response) => {
	res.json(model.getJobs());
});

app.get('/skills', (req: express.Request, res: express.Response) => {
	res.json(model.getSkills());
});

app.get('/jobs/:id', (req: express.Request, res: express.Response) => {
	const id = Number(req.params.id);
	if (isNaN(id)) {
		res.status(400).send({
			error: true,
			message: "sent string, should be number"
		});
	} else {
		const job = model.getJob(id);
		if (job === undefined) {
			res.status(404).send({
				error: true,
				message: "id did not correspond to an existing item"
			});
		} else {
			res.json(job);
		}
	}
});

app.get('/skills/:idCode', (req: express.Request, res: express.Response) => {
	const idCode = req.params.idCode;
	const skill = model.getSkill(idCode);
	if (skill === undefined) {
		res.status(404).send({
			error: true,
			message: "idCode did not correspond to an existing item"
		});
	} else {
		res.json(skill);
	}
});

app.listen(config.port, () => {
	console.log(`listening on port http://localhost:${config.port}`);
});