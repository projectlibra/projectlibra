


def get_mail_template(patient_1, patient_2, mail_to_contact,  genotype_sim, phenotype_sim):
    
    phenotype_text = ""
    if phenotype_sim == 0:
        phenotype_sim = "-"
        phenotype_text = "Phenotype similiarty couldn't be calculated"
    else:
        phenotype_sim = "{:0.2f}".format(phenotype_sim)
        phenotype_text = "According to threshold that you set for the matchmaking system."
    
    genotype_text = ""
    if genotype_sim == 0:
        genotype_sim = "-"
        genotype_text = "Genotype similiarty couldn't be calculated"
    else:
        genotype_sim = "{:0.2f}".format(genotype_sim)
        genotype_text = "According to threshold that you set for the matchmaking system."
    
    return """
    <!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
    <html xmlns='http://www.w3.org/1999/xhtml'>
    <head>
    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
    <title>Libra Similarity Report</title>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
    </head>
    <body style='margin: 0; padding: 0;'>
        <table border='0' cellpadding='0' cellspacing='0' width='100%'>	
            <tr>
                <td style='padding: 10px 0 30px 0;'>
                    <table align='center' border='0' cellpadding='0' cellspacing='0' width='600' style='border: 1px solid #cccccc; border-collapse: collapse;'>
                        <tr>
                            <td align='center' bgcolor='#70bbd9' style='padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;'>
                                <img src='https://i.hizliresim.com/XDb1Lk.png' alt='Libra Similarity Report' width='300' height='230' style='display: block;' />
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor='#ffffff' style='padding: 40px 30px 40px 30px;'>
                                <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                    <tr>
                                        <td style='color: #153643; font-family: Arial, sans-serif; font-size: 24px;'>
                                            <b>You have a new patient match!</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style='padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;'>
                                            <h3>Your Patient ID: {}</h3>
                                            <h3>Matched Patient ID: {}</h3>
                                            <a href='mailto:{}' target='_blank' style='display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;'>Contact Doctor</a>
                                            <p>According to our matchmaking system, you have a new match. You can cotact with the respective doctor using the button above.</p>
                                            
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                                <tr>
                                                    <td width='260' valign='top'>
                                                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>

                                                            <tr>
                                                                <td style='padding: 25px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;'>
                                                                    <h4>Genotype Similarity: {}%</h4>
                                                                    {}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td style='font-size: 0; line-height: 0;' width='20'>
                                                        &nbsp;
                                                    </td>
                                                    <td width='260' valign='top'>
                                                        <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                                            <tr>
                                                                <td style='padding: 25px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;'>
                                                                    <h4>Phenotype Similarity: {}%</h4>
                                                                    {}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor='#70bbd9' style='padding: 30px 30px 30px 30px;'>
                                <table border='0' cellpadding='0' cellspacing='0' width='100%'>
                                    <tr>
                                        <td style='color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;' width='75%'>
                                            &reg; LIBRA 2020<br/>
                                            <a href='mailto:projectlibra.info@gmail.com' style='color: #ffffff;'><font color='#ffffff'>Contact us</font></a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """.format(patient_1, patient_2, mail_to_contact, genotype_sim, genotype_text, phenotype_sim, phenotype_text)