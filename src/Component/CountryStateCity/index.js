import React from "react";
import { Country, State, City } from "country-state-city";
import { DropDown } from "../DropDown/DropDown";
import { Col, Row } from "react-bootstrap";
import classes from "./CountryStateCity.module.css";
import { Input } from "../Input";

const CountryStateCity = ({
  selectedCountry,
  setSelectedCountry,
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  countryLabel = "Country / Region",
  stateLabel = "State / Province / Region",
}) => {
  const getStatesOfCountry = (country) => {
    if (typeof country == "string") {
      return State?.getStatesOfCountry(
        Country.getAllCountries()?.find((item) => item?.name == country)
          ?.isoCode
      );
    } else {
      return State?.getStatesOfCountry(country?.isoCode);
    }
  };
  const getCitiesOfState = (state, country) => {
    if (typeof state == "string") {
      return City.getCitiesOfState(
        Country.getAllCountries()?.find((item) => item?.name == country)
          ?.isoCode,
        State?.getStatesOfCountry(
          Country.getAllCountries()?.find((item) => item?.name == country)
            ?.isoCode
        )?.find((item) => item?.name == state)?.isoCode
      );
    } else {
      return City.getCitiesOfState(state?.countryCode, state?.isoCode);
    }
  };
  return (
    <>
      <style>{`
            .DropdownOptionContainer__indicator {
              padding:5px;
            }
            `}</style>
      <Col xl={12} lg={12} className={classes["mb-16"]}>
        <DropDown
          labelClassName={classes.label}
          customStyle={{
            backgroundColor: "white",
            color: "var(--text-color-gray) !important",
            border: "1px solid var(--border-color)",
            padding: "5px 0",
          }}
          placeholderColor={"var(--text-color-gray)"}
          indicatorColor="var(--main-color)"
          options={Country.getAllCountries()}
          getOptionLabel={(options) => {
            return options["name"];
          }}
          getOptionValue={(options) => {
            return options["name"];
          }}
          value={
            typeof selectedCountry == "string"
              ? Country.getAllCountries()?.find(
                  (item) => item?.name == selectedCountry
                )
              : selectedCountry
          }
          setter={(e) => {
            setSelectedState("");
            setSelectedCountry(e);
          }}
          placeholder="Select Country"
          label={countryLabel}
        />
      </Col>
      {/* {selectedState && ( */}
      <Col xl={12} lg={12} className={classes["mb-16"]}>
        {getStatesOfCountry(selectedCountry)?.length === 0 &&
        selectedCountry ? (
          <Input
            placeholder="Enter State"
            label={stateLabel}
            value={selectedState}
            setter={setSelectedState}
          />
        ) : (
          <DropDown
            labelClassName={classes.label}
            options={getStatesOfCountry(selectedCountry)}
            optionValue={"name"}
            optionLabel={"name"}
            value={
              typeof selectedState == "string"
                ? State?.getStatesOfCountry(
                    Country.getAllCountries()?.find(
                      (item) => item?.name == selectedCountry
                    )?.isoCode
                  )?.find((item) => item?.name == selectedState)
                : selectedState
            }
            setter={(e) => {
              setSelectedState(e);
              if (selectedCity) setSelectedCity("");
            }}
            customStyle={{
              backgroundColor: "white",
              color: "var(--text-color-gray) !important",
              border: "1px solid var(--border-color)",
              padding: "5px 0",
            }}
            placeholderColor={"var(--text-color-gray)"}
            indicatorColor="var(--main-color)"
            placeholder="Select State"
            label={stateLabel}
            disabled={!selectedCountry}
          />
        )}
      </Col>
      {/* )} */}
      {/* {selectedCity && ( */}
      <Col xl={12} lg={12} className={classes["mb-16"]}>
        {(getCitiesOfState(selectedState, selectedCountry)?.length === 0 &&
          selectedState) ||
        (getStatesOfCountry(selectedCountry)?.length === 0 &&
          selectedCountry) ? (
          <Input
            value={selectedCity}
            setter={setSelectedCity}
            placeholder="Enter City"
            label={"Town / City"}
          />
        ) : (
          <DropDown
            labelClassName={classes.label}
            customStyle={{
              backgroundColor: "white",
              color: "var(--text-color-gray) !important",
              border: "1px solid var(--border-color)",
              padding: "5px 0",
            }}
            placeholderColor={"var(--text-color-gray)"}
            indicatorColor="var(--main-color)"
            options={getCitiesOfState(selectedState, selectedCountry)}
            getOptionLabel={(options) => {
              return options["name"];
            }}
            getOptionValue={(options) => {
              return options["name"];
            }}
            value={
              typeof selectedCity == "string"
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
            placeholder="Select City"
            label={"Town / City"}
          />
        )}
      </Col>
      {/* )} */}
    </>
  );
};
export default CountryStateCity;
