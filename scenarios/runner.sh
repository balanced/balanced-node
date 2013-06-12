#!/bin/bash

for name in **/run.js
do
	echo "Running $name"
	node $name
done
