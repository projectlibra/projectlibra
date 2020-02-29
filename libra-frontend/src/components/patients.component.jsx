import React from 'react';
import  Patient  from './patient-profile/patient.component';
import './patients.css';
import PatientExpand from "./patient-profile/patientexpand.component";
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { Link } from "react-router-dom";



const Patients = () => {

  
  return (
    <div className="App">
      <header className="header">
        <h1 className="title">Patient Management</h1>
         <Button component={Link} to="/createPatientProfile">
         <Fab color="primary" aria-label="add">
            <AddIcon />
        </Fab>
         </Button>
         
      </header>
      <div className="patients">
        <PatientExpand title = "Halil Şahiner">
              <Patient  isPrivate={true} name="Halil" surname="Şahiner" nationalID="1233" nationality="Turkish" VCFfile="halil_sahiner.vcf" phenotypes={["type1","type2"]} genotypes={["type1","type2"]} images= {["https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.UmXL6b9itJ5gMY3PDxhlSAHaE8%26pid%3DApi&f=1",                                                                                                                                                                                                  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.2dFc78Kiy8NpZhZQnkbf2AHaEJ%26pid%3DApi&f=1"]} />
        </PatientExpand>  
        <PatientExpand title = "Abdullah Talayhan">
        <Patient  name="Abdullah" surname="Talayhan" nationalID="1234" nationality="Turkish" VCFfile="abdullah_talayhan.vcf" phenotypes={["type5","type23"]} genotypes={["type8","type222"]} images= {["https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.UmXL6b9itJ5gMY3PDxhlSAHaE8%26pid%3DApi&f=1",
                                                                                                                                                                                                  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.2dFc78Kiy8NpZhZQnkbf2AHaEJ%26pid%3DApi&f=1"]} />
        </PatientExpand>
        <PatientExpand title = "Mahmud Sami Aydın">
        <Patient  name="Mahmud Sami" surname="Aydın" nationalID="1235" nationality="Turkish" VCFfile="mahmud_sami_aydın.vcf" phenotypes={["type3","type21"]} genotypes={["type9","type2123"]} images= {["https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.UmXL6b9itJ5gMY3PDxhlSAHaE8%26pid%3DApi&f=1",
                                                                                                                                                                                                    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.2dFc78Kiy8NpZhZQnkbf2AHaEJ%26pid%3DApi&f=1"]} />
        </PatientExpand>
        <PatientExpand title = "Berke Egeli">
        <Patient  name="Berke" surname="Egeli" nationalID="1236" nationality="Turkish" VCFfile="berke_egeli.vcf" phenotypes={["type7","type26"]} genotypes={["type10","type211"]} images= {["https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.UmXL6b9itJ5gMY3PDxhlSAHaE8%26pid%3DApi&f=1"]} />
        </PatientExpand>
        <PatientExpand title = "Naisila Puka">
        <Patient  name="Naisila" surname="Puka" nationalID="1237" nationality="Albanian" VCFfile="naisila_puka.vcf" phenotypes={["type7","type26"]} genotypes={["type10","type211"]} images= {["https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.UmXL6b9itJ5gMY3PDxhlSAHaE8%26pid%3DApi&f=1"]} />
        </PatientExpand>
      </div>
      
    </div>
  );
};

export default Patients;