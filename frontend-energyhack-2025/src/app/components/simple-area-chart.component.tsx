import React from 'react';
import
	{
		AreaChart,
		Area,
		XAxis,
		YAxis,
		CartesianGrid,
		Tooltip,
	} from "recharts";

const data = [
	{
		"index": 0,
		"sum": 3.5366640700325063e-9
	},
	{
		"index": 1,
		"sum": 3.309711257928547e-9
	},
	{
		"index": 2,
		"sum": 3.401597020351168e-9
	},
	{
		"index": 3,
		"sum": 3.5291324501618e-9
	},
	{
		"index": 4,
		"sum": 3.6255371845068453e-9
	},
	{
		"index": 5,
		"sum": 3.607649267586996e-9
	},
	{
		"index": 6,
		"sum": 3.55172730977392e-9
	},
	{
		"index": 7,
		"sum": 3.498001754696212e-9
	},
	{
		"index": 8,
		"sum": 3.461849979316821e-9
	},
	{
		"index": 9,
		"sum": 3.582858005239507e-9
	},
	{
		"index": 10,
		"sum": 3.5381703940066477e-9
	},
	{
		"index": 11,
		"sum": 3.558756821653246e-9
	},
	{
		"index": 12,
		"sum": 3.605138727630094e-9
	},
	{
		"index": 13,
		"sum": 3.639094100274116e-9
	},
	{
		"index": 14,
		"sum": 3.661186851894856e-9
	},
	{
		"index": 15,
		"sum": 3.651646800058627e-9
	},
	{
		"index": 16,
		"sum": 3.702045569966519e-9
	},
	{
		"index": 17,
		"sum": 3.74924372115628e-9
	},
	{
		"index": 18,
		"sum": 3.7575915862399e-9
	},
	{
		"index": 19,
		"sum": 3.752068398334716e-9
	},
	{
		"index": 20,
		"sum": 3.748051534403672e-9
	},
	{
		"index": 21,
		"sum": 3.7430304544898675e-9
	},
	{
		"index": 22,
		"sum": 3.7430304544898675e-9
	},
	{
		"index": 23,
		"sum": 3.741712101285573e-9
	},
	{
		"index": 24,
		"sum": 3.750750045130421e-9
	}
];
export const SimpleAreaChart = () =>
{
	return (
		<AreaChart
			width={ 500 }
			height={ 400 }
			data={ data }
			margin={ {
				top: 10,
				right: 30,
				left: 0,
				bottom: 0,
			} }
		>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="name" />
			<YAxis />
			<Tooltip />
			<Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
		</AreaChart>
	);
};
