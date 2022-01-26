import React from "react"
import {
    Container,
    Jumbotron,
    Form,
    InputGroup,
    Button
} from "react-bootstrap"
import axios from "axios"
import "./stylesheets/App.css"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import { MDBContainer } from "mdbreact";
import { Bar } from "react-chartjs-2";

import { Chart as ChartJS } from 'chart.js/auto'

const API_BASE_ADDRESS = "http://127.0.0.1:3001"

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));



function createData(feature, number) {
    return { feature, number };
}

class App extends React.Component {

    default_state = {
        current_step: 1,
        selected_filename: "Archive",
        selected_filename_all: "Archive",
        predicted_grade: "NaN",
        adjusted_grade: "",
        table_content_pytorch: [],
        table_content_weights: [],
        model: 1,
        checked: false,
        checked1: false,
        expanded: 'panel1',
        done: '0',
        rows: [],
        filesData: {
            labels: ["Header Files", "Source Files"],
            datasets: [
                {
                    label: "Number of files",
                    data: [0, 0],
                    backgroundColor: "#02b844",
                    borderWidth: 1,
                    borderColor: "#000000",
                }
            ]
        },
        variablesData: {
            labels: ["Static Variables", "Global Variables"],
            datasets: [
                {
                    label: "Number of variables",
                    data: [0, 0],
                    backgroundColor: "#02b844",
                    borderWidth: 1,
                    borderColor: "#000000",
                }
            ]
        },
        paramsData: {
            labels: ["Public Parameters", "Private Parameters"],
            datasets: [
                {
                    label: "Number of parameters",
                    data: [0, 0],
                    backgroundColor: "#02b844",
                    borderWidth: 1,
                    borderColor: "#000000",
                }
            ]
        }
    }

    constructor(props) {

        super(props)

        /* Initialize the state */
        this.state = this.default_state;

        /* Bind methods */
        this.selectArchive = this.selectArchive.bind(this)
        this.selectMultipleArchives = this.selectMultipleArchives.bind(this)
        this.adjustGrade = this.adjustGrade.bind(this)
        this.sendChangeRequest = this.sendChangeRequest.bind(this)
        this.retrainModel = this.retrainModel.bind(this)
        this.restartGradingProcess = this.restartGradingProcess.bind(this)
        this.handleChange1 = this.handleChange1.bind(this)
        this.handleChange2 = this.handleChange2.bind(this)
        this.handleChangePanel = this.handleChangePanel.bind(this)

    }


    handleChangePanel = (panel) => (event, newExpanded) => {
        console.log(panel)
        if (newExpanded === true)
            this.setState({
                expanded: panel
            })
        else
            this.setState({
                expanded: false
            })
    };

    selectArchive(event) {

        var form_data = new FormData();

        form_data.append("file", event.target.files[0])

        axios.post(API_BASE_ADDRESS + "/predict", form_data, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "multipart/form-data"
            }
        }).then(response => {
            this.setState({
                current_step: 2,
                selected_filename: event.target.files[0].name,
                predicted_grade: response.data.predicted_grade
            })
        }).catch(error => console.log(error))
            .then(
                axios.get(API_BASE_ADDRESS + "/return_statistics", {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "application/json"
                    }
                }).then(response => {
                    this.setState({
                        rows: [
                            createData('Classes', response.data[0].nr_clase),
                            createData('Errors', response.data[0].nr_errors),
                            createData('Inheritances', response.data[0].nr_inheritance),
                            createData('Virtual classes', response.data[0].nr_virtual),
                            createData('Static variables', response.data[0].nr_static),
                            createData('Global variables', response.data[0].nr_global),
                            createData('Public parameters', response.data[0].nr_public),
                            createData('Private parameters', response.data[0].nr_private),
                            createData('Protected', response.data[0].nr_protected),
                            createData('Defines', response.data[0].nr_define),
                            createData('Templates', response.data[0].nr_template),
                            createData('Stl', response.data[0].nr_stl),
                            createData('Namespaces', response.data[0].nr_namespace),
                            createData('Enums', response.data[0].nr_enum),
                            createData('Structs', response.data[0].nr_struct),
                            createData('Cpps', response.data[0].nr_cpp),
                            createData('Comments', response.data[0].nr_comments),
                            createData('Functions', response.data[0].nr_function),
                            createData('Headers size', response.data[0].headers_size),
                            createData('Sources size', response.data[0].sources_size)
                        ],
                        done: 1,
                        filesData: {
                            labels: ["Header Files", "Source Files"],
                            datasets: [
                                {
                                    label: "Number of files",
                                    data: [response.data[0].nr_clase, response.data[0].nr_cpp],
                                    backgroundColor: "#9575cd",
                                    borderWidth: 1,
                                    borderColor: "#000000",
                                }
                            ]
                        },
                        variablesData: {
                            labels: ["Static Variables", "Global Variables"],
                            datasets: [
                                {
                                    label: "Number of variables",
                                    data: [response.data[0].nr_static, response.data[0].nr_global],
                                    backgroundColor: "#9575cd",
                                    borderWidth: 1,
                                    borderColor: "#000000",
                                }
                            ]
                        },
                        paramsData: {
                            labels: ["Public Parameters", "Private Parameters"],
                            datasets: [
                                {
                                    label: "Number of parameters",
                                    data: [response.data[0].nr_public, response.data[0].nr_static],
                                    backgroundColor: "#9575cd",
                                    borderWidth: 1,
                                    borderColor: "#000000",
                                }
                            ]
                        }
                    })
                })
            );

    }

    selectMultipleArchives(event) {

        var form_data = new FormData();

        form_data.append("file", event.target.files[0])

        axios.post(API_BASE_ADDRESS + "/predict_multiple", form_data, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "multipart/form-data"
            }
        }).then(response => {
            if (this.state.model === 1) {
                let newTab = this.state.table_content_pytorch;
                newTab.push({
                    grade: "New predict"
                })
                response.data.predicted_grade.map((item) => (
                    newTab.push({
                        grade: item
                    })
                ));

                this.setState({
                    current_step: 3,
                    selected_filename_all: event.target.files[0].name,
                    table_content_pytorch: newTab
                });
            }
            else {
                let newTab = this.state.table_content_weights;
                newTab.push({
                    grade: "New predict"
                })
                response.data.predicted_grade.map((item) => (
                    newTab.push({
                        grade: item
                    })
                ));

                this.setState({
                    current_step: 3,
                    selected_filename_all: event.target.files[0].name,
                    table_content_weights: newTab
                });
            }
            console.log(response.data.predicted_grade);
        }).catch(error => console.log(error));

    }

    adjustGrade(event) {
        this.setState({
            adjusted_grade: event.target.value
        })
    }

    handleChange1() {
        this.setState({
            model: 1,
            checked: true,
            checked1: false
        })
    }

    handleChange2() {
        this.setState({
            model: 2,
            checked: false,
            checked1: true
        })
    }

    sendChangeRequest() {
        axios.get(API_BASE_ADDRESS + "/adjust_grade", {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            params: {
                adjusted_grade: this.state.adjusted_grade
            }
        }).catch(error => console.log(error));
    }

    retrainModel() {
        axios.get(API_BASE_ADDRESS + "/retrain_model", {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            params: {
                model: this.state.model
            }
        }).catch(error => console.log(error));
    }

    restartGradingProcess() {
        this.setState(this.default_state)
    }

    render() {

        var first_step_classes = ["process-step"]
        var first_step_classes_all = ["process-step"]
        var second_step_classes = ["process-step"]

        // Get classes for each jumbotron
        if (this.state.current_step === 1) {
            first_step_classes.push("current")
            second_step_classes.push("inactive")
            first_step_classes_all.push("innactive")
        }
        else {
            if (this.state.current_step === 2) {
                first_step_classes.push("done")
                second_step_classes.push("current")
                first_step_classes_all.push("innactive")
            }
            else {
                first_step_classes.push("innactive")
                second_step_classes.push("innactive")
                first_step_classes_all.push("done")
            }
        }
        first_step_classes = first_step_classes.join(" ")
        second_step_classes = second_step_classes.join(" ")

        return (
            <div className="App">


                <Container>

                    {/* Logo and application name */}
                    <div className="logo-container">
                        <img src="images/logo.png" alt="Naevia Logo"></img>
                        <h1>Alemia</h1>
                    </div>

                    <Accordion expanded={this.state.expanded === 'panel1'} onChange={this.handleChangePanel('panel1')}>
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                            <Typography>Change model</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {/* Field for choosing model */}
                            <Jumbotron className="process-step inactive">
                                <h3>Model</h3>
                                <p>Select the model you want to use.</p>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox checked={this.state.checked} onChange={this.handleChange1} />} label="Basic model" />
                                    <FormControlLabel control={<Checkbox checked={this.state.checked1} onChange={this.handleChange2} />} label="Our model" />
                                </FormGroup>
                                <br></br>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    block
                                    onClick={this.retrainModel}
                                >
                                    Retrain the model
                                </Button>
                            </Jumbotron>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={this.state.expanded === 'panel2'} onChange={this.handleChangePanel('panel2')}>
                        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                            <Typography>For one student</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {/* Field for uploading a file */}
                            <Jumbotron className={first_step_classes}>
                                <h3>First Step</h3>
                                <p>Select the <code>.zip</code> archive containing the source code of the student you want to grade.</p>
                                <Form>
                                    <Form.File
                                        label={this.state.selected_filename}
                                        custom
                                        onChange={this.selectArchive}
                                    />
                                </Form>
                            </Jumbotron>

                            {/* Place to bind the predicted grade, change it or retrain the model */}
                            <Jumbotron className={second_step_classes}>

                                <h3>Second Step</h3>
                                <p>Review the predicted grade. If you consider it is not right, create a change request to improve the machine learning models trained in the future.</p>

                                <p className="grade">The predicted grade is <b>{this.state.predicted_grade}</b>.</p>
                                <Form>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Manually adjusted grade"
                                            value={this.state.adjusted_grade}
                                            onChange={this.adjustGrade}
                                        />
                                        <InputGroup.Append>
                                            <Button
                                                variant="outline-secondary"
                                                onClick={this.sendChangeRequest}
                                            >
                                                Send a change request
                                            </Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Form>

                                <p>Go to the next student or retrain the machine learning model. When the training process ends, the new model will automatically replace the current one.</p>

                                <Button
                                    variant="secondary"
                                    size="sm"
                                    block
                                    onClick={this.restartGradingProcess}
                                >
                                    Restart the grading process
                                </Button>

                            </Jumbotron>

                            {this.state.done === 1 ? (
                                <div>
                                    <TableContainer component={Paper} style={{ display: "flex", border: "2px solid black" }}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableCell className="header">Feature</TableCell>
                                                <TableCell className="header" align="right">Number</TableCell>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.rows.map((row) => (
                                                    <TableRow
                                                        key={row.feature}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell component="th" scope="row">
                                                            {row.feature}
                                                        </TableCell>
                                                        <TableCell align="right">{row.number}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    <MDBContainer>
                                        <Bar data={this.state.filesData}
                                            style={{ maxHeight: '400px' }}
                                        />
                                    </MDBContainer>

                                    <br></br><MDBContainer>
                                        <Bar data={this.state.variablesData}
                                            style={{ maxHeight: '400px' }}
                                        />
                                    </MDBContainer>

                                    <br></br><MDBContainer>
                                        <Bar data={this.state.paramsData}
                                            style={{ maxHeight: '400px' }}
                                        />
                                    </MDBContainer>

                                </div>

                            )
                                :
                                <h1>Add archive to see statistics</h1>
                            }
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={this.state.expanded === 'panel3'} onChange={this.handleChangePanel('panel3')}>
                        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                            <Typography>For multiple students</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {/* Field for uploading a file with more than one project */}
                            <Jumbotron className={first_step_classes_all}>
                                <h3>View grades</h3>
                                <p>Select the <code>.zip</code> archive containing folders with source code from different students.</p>
                                <Form>
                                    <Form.File
                                        label={this.state.selected_filename_all}
                                        custom
                                        onChange={this.selectMultipleArchives}
                                    />
                                </Form>
                            </Jumbotron>

                            {/* Display grades */}
                            <TableContainer component={Paper} style={{ display: "flex", border: "2px solid black" }}>
                                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Grades with basic model</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.table_content_pytorch.map((row) => (
                                            <TableRow
                                                key={row.grade}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.grade}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Grades with our model</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.table_content_weights.map((row) => (
                                            <TableRow
                                                key={row.grade}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.grade}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>
                    </Accordion>
                </Container>


            </div>
        )
    }
}

export default App