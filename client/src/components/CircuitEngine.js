import React, { Component } from 'react';
import svgjs from 'svgjs';

class CircuitEngine extends Component {
	// Maybe make this whole JSON file smarter. Make the id's actually designate the location and index
	// consistently rather than assume that they are arbitrary.
	// This will allow for smaller circuit size at each level and simplier logic
	// constructing a new circuit will be more difficult but everything else can be done much quicker
	// deserializing can be a step of making more accessable properies so that less actions need be
	// performed on them after the initial build stage.

	//currently, I am getting reference data though so maybe this is good enough and not too many assumptions should be made

	constructor(props) {
		super(props);
		this.state = {
			svgPanel: null,
			builtCircuit: null
		};
	}

	getRef(circuit, id) {
		for (var i = 0; i < circuit.input.length; i++) {
			if (circuit.input[i].id === id) {
				return circuit.input;
			}
		}
		// check circuit internal logic
		for (i = 0; i < circuit.internalLogic.length; i++) {
			if (circuit.internalLogic[i].id === id) {
				return circuit.internalLogic[i];
			}
		}

		console.log('something has gone terribly awry');
	}

	deserializeCircuit(circuit) {
		//deserialize internalLogic
		for (var i = 0; i < circuit.internalLogic.length; i++) {
			if (circuit.internalLogic[i].type !== 'circuit') {
				//get reference for each input of the gate
				for (var j = 0; j < circuit.internalLogic[i].input.length; j++) {
					// the input ID
                    var input = circuit.internalLogic[i].input[j];
					var parsedInputID = '';
                    // if the gate's input is a component or a bus the output will need to be selected
					var divider = input.indexOf(':');
					if (divider === -1) {
                        parsedInputID = input;
                        circuit.internalLogic[i].input[j] = {};
						circuit.internalLogic[i].input[j].pin = null;
					} else {
						parsedInputID = input.substring(0, divider);
                        // get the string versin of input pin and convert to digit
                        circuit.internalLogic[i].input[j] = {};
						circuit.internalLogic[i].input[j].pin = parseInt(
							input.substring(divider + 1, input.length),
							10
						);
					}
					circuit.internalLogic[i].input[j].ref = this.getRef(circuit, parsedInputID);
				}
			} else {
				// get reference for each input of the circuit
				for (j = 0; j < circuit.internalLogic[i].input.length; j++) {
					// TODO
				}
			}
		}
		//deserialize outputs
		for (i = 0; i < circuit.output.length; i++) {
			input = circuit.output[i].input;
            parsedInputID = '';
            
			// if the gate's input is a component or a bus the output will need to be selected
			divider = input.indexOf(':');
			if (divider === -1) {
				parsedInputID = input;
				circuit.output[i].input = {};
				circuit.output[i].input.pin = null;
			} else {
				parsedInputID = input.substring(0, divider);
				// get the string versin of input pin and convert to digit
				circuit.output[i].input = {};
				circuit.output[i].input.pin = parseInt(
					input.substring(divider + 1, input.length),
					10
				);
			}
			circuit.output[i].input.ref = this.getRef(circuit, parsedInputID);
		}
	}

	buildLocalCircuit() {
		var tempCircuit = {};
		//build step
		tempCircuit.input = [];
		for (var i = 0; i < this.props.circuitData.input.length; i++) {
			tempCircuit.input[i] = this.props.circuitData.input[i];
			tempCircuit.input[i].output = false;
		}

		tempCircuit.internalLogic = [];
		for (i = 0; i < this.props.circuitData.internalLogic.length; i++) {
			tempCircuit.internalLogic[i] = this.props.circuitData.internalLogic[i];

			if (tempCircuit.internalLogic[i].type !== 'circuit') {
				//TODO:default state should also be definable for dependant logic
				tempCircuit.internalLogic[i].output = false;
			}
		}

		tempCircuit.output = [];
		for (i = 0; i < this.props.circuitData.output.length; i++) {
			tempCircuit.output[i] = this.props.circuitData.output[i];
			tempCircuit.output[i].output = false;
		}

		this.deserializeCircuit(tempCircuit);
		tempCircuit.input[0].output = true;
	}

	componentDidMount() {
		//if the panel hasn't been defined
		if (!this.state.svgPanel) {
			// This might be a huge bug...
			const svgPanel = svgjs(this.canvas).size(1000, 1500);
			this.setState({ svgPanel: svgPanel, builtCircuit: null });
		}

		// if a built circuit is not defined and circuitData has been received
	}

	render() {
		if (!this.state.builtCircuit && this.props.circuitData) {
			this.buildLocalCircuit();
		}
		return <div ref={ref => (this.canvas = ref)} />;
	}
}

export default CircuitEngine;
