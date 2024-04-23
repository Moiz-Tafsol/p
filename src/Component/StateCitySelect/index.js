import React from 'react';
import { Country, State, City } from 'country-state-city';
import { DropDown } from '../DropDown/DropDown';
import { Col, Row } from 'react-bootstrap';
import classes from './StateCitySelect.module.css';

const StateCitySelect = ({
  selectedCountry,
  setSelectedCountry,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  style,
  label,
}) => {
  return (
    <>
      <style>{`
            .DropdownOptionContainer__indicator {
              padding:5px;
            }
            `}</style>
      <Col
        xl={6}
        lg={12}
        className={classes['mb-16']}
      >
        <DropDown
          options={Country.getAllCountries()}
          // options={Country.getAllCountries()}
          getOptionLabel={(options) => {
            return options['name'];
          }}
          getOptionValue={(options) => {
            return options['name'];
          }}
          value={
            typeof selectedCountry == 'string'
              ? Country.getAllCountries()?.find(
                  (item) => item?.name == selectedCountry
                )
              : selectedCountry
          }
          setter={setSelectedCountry}
          customStyle={{
            borderRadius: '2px',
            border: '1px solid #707070',
            padding: '8px',
          }}
          placeholder='Select Country'
          label={'Country / Region'}
        />
      </Col>
      <Col
        xl={6}
        lg={12}
        className={classes['mb-16']}
      >
        <DropDown
          options={
            typeof selectedCountry == 'string'
              ? State?.getStatesOfCountry(
                  Country.getAllCountries()?.find(
                    (item) => item?.name == selectedCountry
                  )?.isoCode
                )
              : State?.getStatesOfCountry(selectedCountry?.isoCode)
          }
          optionValue={'name'}
          optionLabel={'name'}
          value={
            typeof selectedState == 'string'
              ? State?.getStatesOfCountry(
                  Country.getAllCountries()?.find(
                    (item) => item?.name == selectedCountry
                  )?.isoCode
                )?.find((item) => item?.name == selectedState)
              : selectedState
          }
          setter={setSelectedState}
          placeholder='Select State'
          label={'State'}
          customStyle={{
            borderRadius: '2px',
            border: '1px solid #707070',
            padding: '8px',
          }}
        />
      </Col>
      <Col
        xl={6}
        lg={12}
        className={classes['mb-16']}
      >
        <DropDown
          options={
            typeof selectedCountry == 'string'
              ? City.getCitiesOfState(
                  Country.getAllCountries()?.find(
                    (item) => item?.name == selectedCountry
                  )?.isoCode,
                  State?.getStatesOfCountry(
                    Country.getAllCountries()?.find(
                      (item) => item?.name == selectedCountry
                    )?.isoCode
                  )?.find((item) => item?.name == selectedState)?.isoCode
                )
              : City.getCitiesOfState(
                  selectedState?.countryCode,
                  selectedState?.isoCode
                )
          }
          getOptionLabel={(options) => {
            return options['name'];
          }}
          getOptionValue={(options) => {
            return options['name'];
          }}
          value={
            typeof selectedCity == 'string'
              ? City.getCitiesOfState(
                  Country.getAllCountries()?.find(
                    (item) => item?.name == selectedCountry
                  )?.isoCode,
                  State?.getStatesOfCountry(
                    Country.getAllCountries()?.find(
                      (item) => item?.name == selectedCountry
                    )?.isoCode
                  )?.find((item) => item?.name == selectedState)?.isoCode
                )?.find((item) => item?.name == selectedCity)
              : selectedCity
          }
          setter={setSelectedCity}
          placeholder='Select City'
          customStyle={{
            borderRadius: '2px',
            border: '1px solid #707070',
            padding: '8px',
          }}
          label={'Town / City'}
        />
      </Col>
    </>
  );
};
export default StateCitySelect;
