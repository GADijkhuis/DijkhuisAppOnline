import {useParams, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getAllTimeRegistrationWeekNumbers, getTimeRegistrationData} from "../handlers/timeregistrationhandler";
import Container from "../components/Container";
import {Button, Dropdown, Option, Spinner} from "@fluentui/react-components";
import {generateHoursPdf} from "../handlers/pdfhandler";

const TimeRegistration = () => {
    const {week} = useParams();

    const [weekNumber, setWeekNumber] = useState(week);
    const [allWeekNumbers, setAllWeekNumbers] = useState([]);

    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    useEffect(() => {
        getAllTimeRegistrationWeekNumbers().then(weekNumbers => {
            setAllWeekNumbers(weekNumbers);
        });
    }, [weekNumber])

    const generatePDF = async () => {
        setIsGeneratingPDF(true);

        const result = await getTimeRegistrationData(weekNumber);
        if (!result) return;

        await generateHoursPdf(result, weekNumber);

        setIsGeneratingPDF(false);
    }

    return (
      <Container children={
          <>
              { allWeekNumbers.length !== 0 && <>
                  <div>
                      <Dropdown defaultValue={weekNumber}
                                defaultSelectedOptions={Array.from([weekNumber])}
                                onOptionSelect={(e, data) => setWeekNumber(data.optionValue)}>
                          {allWeekNumbers.map(item => (
                              <Option key={item.week} text={item.week} value={item.week}>
                                  {item.week}
                              </Option>
                          ))}
                      </Dropdown>
                  </div>
                  <Button as={`a`} onClick={generatePDF} appearance={`primary`}>Maak PDF</Button>
                  { isGeneratingPDF && <Spinner /> }
              </> }
          </>
      } />
    );
}

export default TimeRegistration;