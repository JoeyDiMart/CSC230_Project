import React from "react";
import "./researchAssociates.css"

function ResearchAssociates() {
    return(
        <div className="researchAssociates">
            <div className="pictureContainers">
                <div className="row">

                    <div className="col-sm-6 col-md-3">
                        <div className="box">
                            <div className="box-image">
                                <img src="#" alt="Name1"/>
                            </div>
                            <div className="box-content">
                                <h3 className="name">Name1</h3>
                                <h4>JobTitle</h4>
                                <a href="mailto:blank@ut.edu" className="emailButton">Email me.</a>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-3">
                        <div className="box">
                            <div className="box-image">
                                <img src="#" alt="Brandon Dulisse"/>
                            </div>
                            <div className="box-content">
                                <h3 className="name">Brandon Dulisse</h3>
                                <h4>Director of CIRT</h4>
                                <a href="mailto:Bdulisse@ut.edu" className="emailButton">Email me.</a>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-3">
                        <div className="box">
                            <div className="box-image">
                                <img src="#" alt="Nate Connealy"/>
                            </div>
                            <div className="box-content">
                                <h3 className="name">Nate Connealy</h3>
                                <h4>Associate Director of Consultation and Training</h4>
                                <a href="mailto:Nconnealy@ut.edu" className="emailButton">Email me.</a>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-3">
                        <div className="box">
                            <div className="box-image">
                                <img src="#" alt="Chivon Fitch"/>
                            </div>
                            <div className="box-content">
                                <h3 className="name">Chivon Fitch</h3>
                                <h4>CIRT Liaison to the Industry Advisory Board</h4>
                                <a href="mailto:Cfitch@ut.edu" className="emailButton">Email me.</a>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-3">
                        <div className="box">
                            <div className="box-image">
                                <img src="#" alt="Tim Hart"/>
                            </div>
                            <div className="box-content">
                                <h3 className="name">Tim Hart</h3>
                                <h4>Associate Director of Research and Engagementv</h4>
                                <a href="mailto:Thart@ut.edu" className="emailButton">Email me.</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
)
}