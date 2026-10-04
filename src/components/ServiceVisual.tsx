import type { Service } from "../data/services";

export function ServiceVisual({ service, hero = false }: { service: Service; hero?: boolean }) {
  return (
    <div className={`service-visual service-visual--${service.id} ${hero ? "service-visual--hero" : ""}`} aria-hidden="true">
      <div className="service-visual__frame">
        <span className="service-visual__code">ENGINE / {service.shortTitle}</span>

        {service.id === "product" && (
          <div className="svc-product">
            <span className="svc-product__screen"><b>UI</b><i /><i /><i /></span>
            <span className="svc-product__screen svc-product__screen--side"><b>FLOW</b><i /><i /></span>
            <span className="svc-product__module svc-product__module--api">API</span>
            <span className="svc-product__module svc-product__module--data">DATA</span>
            <span className="svc-product__module svc-product__module--release">RELEASE</span>
            <span className="svc-wire svc-wire--product-a" />
            <span className="svc-wire svc-wire--product-b" />
          </div>
        )}

        {service.id === "ai" && (
          <div className="svc-ai">
            <span className="svc-ai__source">CONTEXT</span>
            <span className="svc-ai__model"><i /><b>MODEL</b></span>
            <span className="svc-ai__guard">POLICY</span>
            <span className="svc-ai__eval">EVAL</span>
            <span className="svc-ai__beam svc-ai__beam--a" />
            <span className="svc-ai__beam svc-ai__beam--b" />
            <span className="svc-ai__beam svc-ai__beam--c" />
          </div>
        )}

        {service.id === "mobile" && (
          <div className="svc-mobile">
            <span className="svc-mobile__phone svc-mobile__phone--main"><b>APP</b><i /><i /><i /></span>
            <span className="svc-mobile__phone svc-mobile__phone--alt"><b>OS</b><i /><i /></span>
            <span className="svc-mobile__tile svc-mobile__tile--sync">SYNC</span>
            <span className="svc-mobile__tile svc-mobile__tile--offline">OFFLINE</span>
            <span className="svc-mobile__tile svc-mobile__tile--push">PUSH</span>
          </div>
        )}

        {service.id === "backend" && (
          <div className="svc-backend">
            <span className="svc-backend__gateway">GATEWAY</span>
            <span className="svc-backend__service svc-backend__service--a">SVC</span>
            <span className="svc-backend__service svc-backend__service--b">SVC</span>
            <span className="svc-backend__service svc-backend__service--c">SVC</span>
            <span className="svc-backend__store svc-backend__store--db">DB</span>
            <span className="svc-backend__store svc-backend__store--cache">CACHE</span>
            <span className="svc-backend__queue">QUEUE</span>
          </div>
        )}

        {service.id === "cloud-devops" && (
          <div className="svc-cloudflow">
            {["BUILD", "TEST", "RELEASE", "OBSERVE"].map((step, index) => <span key={step} style={{ "--step": index } as React.CSSProperties}>{step}</span>)}
            <i className="svc-cloudflow__rail" />
            <i className="svc-cloudflow__pulse svc-cloudflow__pulse--a" />
            <i className="svc-cloudflow__pulse svc-cloudflow__pulse--b" />
            <b>ROLLBACK READY</b>
          </div>
        )}
      </div>
    </div>
  );
}
