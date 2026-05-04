import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormField } from "../../components/FormField";
import { StepIndicator } from "../../components/StepIndicator";
import { searchBirthPlacesApi } from "../../services/geocodingApi";
import { generateKundliApi } from "../../services/kundliApi";
import {
  setCurrentStep,
  setHoroscopeComputationError,
  setHoroscopeComputationLoading,
  setHoroscopeComputationSuccess,
  updateHoroscope,
  type HoroscopeDetails,
  type ResolvedBirthPlace,
  type MarsDosha
} from "../../store/bioDataSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getBirthPlaceLabel, getComputedKundli, hasResolvedBirthPlace } from "../../utils/horoscope";
import { findClearBirthPlaceMatch, tryResolveSharedLocation } from "../../utils/locationInput";
import { hasErrors, validateHoroscopeDetails } from "../../utils/validation";

export function Step4Horoscope() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const horoscope = useAppSelector((state) => state.bioData.horoscope);
  const [submitted, setSubmitted] = useState(false);
  const [computeMessage, setComputeMessage] = useState("");
  const [locationCandidates, setLocationCandidates] = useState<ResolvedBirthPlace[]>([]);
  const [locationSearchError, setLocationSearchError] = useState("");
  const [locationStatusMessage, setLocationStatusMessage] = useState("");
  const [isSearchingLocations, setIsSearchingLocations] = useState(false);
  const errors = useMemo(() => validateHoroscopeDetails(horoscope), [horoscope]);
  const isInvalid = hasErrors(errors);
  const computed = getComputedKundli(horoscope);
  const resolvedBirthPlace = getBirthPlaceLabel(horoscope);
  const hasResolvedLocation = hasResolvedBirthPlace(horoscope);

  const updateField = (key: keyof HoroscopeDetails, value: string) => {
    dispatch(updateHoroscope({ [key]: value }));
  };

  const handleBirthPlaceChange = (value: string) => {
    const sharedLocation = tryResolveSharedLocation(value);

    dispatch(updateHoroscope({
      birthPlace: value,
      selectedBirthPlaceLabel: sharedLocation?.displayName ?? "",
      birthLatitude: sharedLocation ? String(sharedLocation.latitude) : "",
      birthLongitude: sharedLocation ? String(sharedLocation.longitude) : "",
      birthLocation: sharedLocation
    }));
    setLocationCandidates([]);
    setLocationStatusMessage(
      sharedLocation
        ? "Coordinates captured from the shared map link. You can still switch to a searched place if needed."
        : ""
    );
    setLocationSearchError("");
  };

  const handleSelectLocation = (location: ResolvedBirthPlace) => {
    dispatch(updateHoroscope({
      birthPlace: location.displayName,
      selectedBirthPlaceLabel: location.displayName,
      birthLatitude: String(location.latitude),
      birthLongitude: String(location.longitude),
      birthLocation: location
    }));
    setComputeMessage("");
    setLocationSearchError("");
    setLocationStatusMessage("Birthplace locked with exact coordinates for kundli generation.");
  };

  useEffect(() => {
    const query = horoscope.birthPlace.trim();
    const sharedLocation = tryResolveSharedLocation(query);

    if (!query || sharedLocation) {
      setLocationCandidates([]);
      setIsSearchingLocations(false);
      if (!query) {
        setLocationSearchError("");
        setLocationStatusMessage("");
      }
      return;
    }

    if (query.length < 2) {
      setLocationCandidates([]);
      setLocationSearchError("");
      setLocationStatusMessage("");
      setIsSearchingLocations(false);
      return;
    }

    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      setIsSearchingLocations(true);
      setLocationSearchError("");

      try {
        const matches = await searchBirthPlacesApi(query);
        if (cancelled) {
          return;
        }

        const clearMatch = findClearBirthPlaceMatch(query, matches);
        if (clearMatch) {
          handleSelectLocation(clearMatch);
          setLocationCandidates(matches.length > 1 ? matches : []);
        } else {
          setLocationCandidates(matches);
          setLocationStatusMessage(matches.length > 0 ? "Choose the closest birthplace match." : "");

          if (matches.length === 0) {
            setLocationSearchError("We couldn't find that place yet. Try a broader city, district, landmark, or hospital name.");
          }
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (typeof error === "object" && error && "response" in error) {
          const response = (error as { response?: { data?: unknown } }).response;
          const data = response?.data;

          if (typeof data === "object" && data && "error" in data && typeof data.error === "string") {
            setLocationSearchError(data.error);
          } else {
            setLocationSearchError("We could not search birthplaces right now. Please try again.");
          }
        } else {
          setLocationSearchError("We could not search birthplaces right now. Please try again.");
        }

        setLocationCandidates([]);
        setLocationStatusMessage("");
      } finally {
        if (!cancelled) {
          setIsSearchingLocations(false);
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [horoscope.birthPlace]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setComputeMessage("");

    if (isInvalid) {
      return;
    }

    if (!computed) {
      setComputeMessage("Generate the kundli once so you can review the computed horoscope before continuing.");
      return;
    }

    dispatch(setCurrentStep(5));
    navigate("/biodata/template");
  };

  const resolveGenerationError = (error: unknown) => {
    if (typeof error === "object" && error && "response" in error) {
      const response = (error as { response?: { data?: unknown } }).response;
      const data = response?.data;
      if (typeof data === "object" && data && "error" in data && typeof data.error === "string") {
        return data.error;
      }
    }

    return "We could not generate the kundli right now. Please review the birth details and try again.";
  };

  const handleGenerateKundli = async () => {
    setSubmitted(true);
    setComputeMessage("");

    if (isInvalid) {
      return;
    }

    if (!hasResolvedLocation) {
      dispatch(setHoroscopeComputationError("Select a birthplace match before generating the kundli."));
      return;
    }

    dispatch(setHoroscopeComputationLoading());

    try {
      const kundli = await generateKundliApi({
        dob: horoscope.dob,
        birthTime: horoscope.birthTime,
        birthPlace: horoscope.birthPlace,
        selectedBirthPlaceLabel: horoscope.selectedBirthPlaceLabel,
        birthLatitude: horoscope.birthLatitude,
        birthLongitude: horoscope.birthLongitude,
        birthTimezone: horoscope.birthTimezone,
        birthLocation: horoscope.birthLocation
      });

      dispatch(setHoroscopeComputationSuccess(kundli));
    } catch (error) {
      dispatch(setHoroscopeComputationError(resolveGenerationError(error)));
    }
  };

  return (
    <section className="page-shell page-shell--narrow">
      <form className="form-panel" onSubmit={handleSubmit}>
        <StepIndicator current={4} />
        <div className="section-heading">
          <p className="eyebrow">Horoscope</p>
          <h1>Kundali details</h1>
          <p className="muted-text">
            Enter birth details, generate the kundli from the astro engine, and review the computed output.
          </p>
        </div>

        <div className="form-grid form-grid--two">
          <FormField
            label="Date of Birth"
            name="horoscopeDob"
            type="date"
            value={horoscope.dob}
            required
            error={submitted ? errors.dob : undefined}
            onChange={(value) => updateField("dob", value)}
          />
          <FormField
            label="Birth Time"
            name="birthTime"
            type="time"
            value={horoscope.birthTime}
            required
            error={submitted ? errors.birthTime : undefined}
            onChange={(value) => updateField("birthTime", value)}
          />
          <FormField
            label="Birth Place"
            name="birthPlace"
            value={horoscope.birthPlace}
            required
            error={submitted ? errors.birthPlace : undefined}
            helperText="Type a city, town, area, landmark, or hospital. You can also paste a Google Maps share link."
            placeholder="Eg. New Delhi, Apollo Hospital Chennai, or a Google Maps link"
            onChange={handleBirthPlaceChange}
          />
          <FormField
            label="Birth Timezone"
            name="birthTimezone"
            value={horoscope.birthTimezone}
            helperText="Defaults to Asia/Kolkata for this sprint."
            onChange={(value) => updateField("birthTimezone", value)}
          />
          <FormField
            label="Gotra"
            name="gotra"
            value={horoscope.gotra}
            onChange={(value) => updateField("gotra", value)}
          />
        </div>

        <section className="birthplace-lookup" aria-live="polite">
          <div className="birthplace-lookup__header">
            <p className="eyebrow">Birthplace Lookup</p>
            {isSearchingLocations ? <span className="status-pill status-pill--muted">Searching</span> : null}
          </div>

          {locationSearchError ? <p className="field-error">{locationSearchError}</p> : null}
          {!locationSearchError && locationStatusMessage ? (
            <p className="field-helper">{locationStatusMessage}</p>
          ) : null}

          {hasResolvedLocation ? (
            <div className="location-selection">
              <strong>{resolvedBirthPlace}</strong>
              <span>
                {horoscope.birthLatitude}, {horoscope.birthLongitude}
              </span>
            </div>
          ) : (
            <p className="muted-text">
              We'll keep suggestions here while you type and only lock the coordinates once you choose a clear match.
            </p>
          )}

          {locationCandidates.length > 0 ? (
            <div className="location-candidate-list">
              {locationCandidates.map((location) => {
                const isSelected = horoscope.selectedBirthPlaceLabel === location.displayName;
                return (
                  <button
                    key={`${location.displayName}-${location.latitude}-${location.longitude}`}
                    className={isSelected ? "location-candidate location-candidate--selected" : "location-candidate"}
                    type="button"
                    onClick={() => handleSelectLocation(location)}
                  >
                    <strong>{location.displayName}</strong>
                    <span>
                      {[location.state, location.country].filter(Boolean).join(", ") || "Location match"}
                    </span>
                    <span>
                      {location.confidence !== null ? `Confidence ${Math.round(location.confidence * 100)}%` : "Confidence unavailable"}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </section>

        <div className="kundli-actions">
          <button
            className="button button--primary"
            type="button"
            disabled={horoscope.computedKundli.status === "loading"}
            onClick={() => void handleGenerateKundli()}
          >
            {horoscope.computedKundli.status === "loading" ? "Generating..." : "Generate Kundli"}
          </button>
          <p className="field-helper">
            Kundli generation runs through the Rishte backend and uses the confirmed birthplace coordinates.
          </p>
        </div>

        <section className="kundli-result-card" aria-live="polite">
          <div className="kundli-result-card__header">
            <div>
              <p className="eyebrow">Computed Result</p>
              <h2>Astro engine output</h2>
            </div>
            <span className={`status-pill ${computed ? "" : "status-pill--muted"}`}>
              {horoscope.computedKundli.status === "loading"
                ? "Generating"
                : computed
                  ? "Ready"
                  : "Not generated"}
            </span>
          </div>

          {horoscope.computedKundli.error ? (
            <p className="field-error">{horoscope.computedKundli.error}</p>
          ) : null}

          {computeMessage ? (
            <p className="field-error">{computeMessage}</p>
          ) : null}

          {computed ? (
            <>
              <div className="kundli-result-grid">
                <div>
                  <span>Rashi</span>
                  <strong>{computed.rashi || "—"}</strong>
                </div>
                <div>
                  <span>Nakshatra</span>
                  <strong>{computed.nakshatra || "—"}</strong>
                </div>
                <div>
                  <span>Pada</span>
                  <strong>{computed.pada ?? "—"}</strong>
                </div>
                <div>
                  <span>Lagna</span>
                  <strong>{computed.lagna || "—"}</strong>
                </div>
              </div>
              <div className="kundli-result-meta">
                <p><strong>Dasha summary:</strong> {computed.dashaSummary ?? "Not returned by the engine for this chart."}</p>
                <p>
                  <strong>Engine:</strong> {computed.engine.engineSemanticVersion ?? "unknown"} · schema {computed.engine.schemaVersion ?? "unknown"}
                </p>
              </div>
            </>
          ) : (
            <p className="muted-text">
              Computed kundli values will appear here after generation. Raw birth inputs stay editable above.
            </p>
          )}
        </section>

        <fieldset className="segmented-field">
          <legend>Mars Dosha</legend>
          {(["yes", "no", "unknown"] as MarsDosha[]).map((option) => (
            <label key={option} className={horoscope.marsDosha === option ? "segment segment--active" : "segment"}>
              <input
                type="radio"
                name="marsDosha"
                value={option}
                checked={horoscope.marsDosha === option}
                onChange={() => updateField("marsDosha", option)}
              />
              {option === "yes" ? "Yes" : option === "no" ? "No" : "Unknown"}
            </label>
          ))}
        </fieldset>

        <div className="form-actions">
          <button
            className="button button--secondary"
            type="button"
            onClick={() => {
              dispatch(setCurrentStep(3));
              navigate("/biodata/family");
            }}
          >
            Back
          </button>
          <button className="button button--primary" type="submit" disabled={submitted && (isInvalid || !computed)}>
            Next
          </button>
        </div>
      </form>
    </section>
  );
}
