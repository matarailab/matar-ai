'use client';

import Script from 'next/script';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

export default function ThirdPartyScripts() {
  return (
    <>
      <Script id="cal-embed" strategy="afterInteractive">
        {`(function (C, A, L) {
          let p = function (a, ar) { a.q.push(ar); };
          let d = C.document;
          C.Cal = C.Cal || function () {
            let cal = C.Cal; let ar = arguments;
            if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
            if (ar[0] === L) {
              const api = function () { p(api, arguments); };
              const namespace = ar[1]; api.q = api.q || [];
              typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar);
              return;
            }
            p(cal, ar);
          };
        })(window, "https://app.cal.com/embed/embed.js", "init");
        Cal("init", {origin:"https://cal.com"});
        Cal("ui", {"theme":"dark","styles":{"branding":{"brandColor":"#3B82F6"}},"hideEventTypeDetails":false,"layout":"month_view"});`}
      </Script>

      {POSTHOG_KEY && (
        <Script id="posthog" strategy="afterInteractive">
          {`!(function (t, e) { var o, n, p, r; e.__SV || ((window.posthog = e), (e._i = []), (e.init = function (i, s, a) { function g(t, e) { var o = e.split("."); 2 == o.length && ((t = t[o[0]]), (e = o[1])), (t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }); } ((p = t.createElement("script")).type = "text/javascript"), (p.crossOrigin = "anonymous"), (p.async = !0), (p.src = s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js"), (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r); var u = e; for (void 0 !== a ? (u = e[a] = []) : (a = "posthog"), u.people = u.people || [], u.toString = function (t) { var e = "posthog"; return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e; }, u.people.toString = function () { return u.toString(1) + ".people (stub)"; }, o = "init me ws ys ps bs capture je Di ks register register_once register_for_session unregister unregister_for_session Ps getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Es $s createPersonProfile Is opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing Ss debug xs getPageViewId captureTraceFeedback captureTraceMetric".split(" "), n = 0; n < o.length; n++) g(u, o[n]); e._i.push([i, s, a]); }), (e.__SV = 1)); })(document, window.posthog || []);
posthog.init("${POSTHOG_KEY}", { api_host: "${POSTHOG_HOST}", person_profiles: "identified_only", session_recording: { recordCrossOriginIframes: true, capturePerformance: false } });`}
        </Script>
      )}
    </>
  );
}
