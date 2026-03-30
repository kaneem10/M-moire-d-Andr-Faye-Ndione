import React from "react";
import SectionLabel from "./SectionLabel";
import portraitImg from "../assets/photo5.jpg";

const BiographySection = () => {
  return (
    <section id="biographie" className="py-20 px-6 bg-warm-white">
      <div className="max-w-[760px] mx-auto">
        <SectionLabel text="Sa Vie" />

        <div className="clearfix font-display text-[clamp(18px,2.4vw,22px)] text-text-mid leading-[1.9] font-normal after:content-[''] after:table after:clear-both">
          <div className="float-right ml-8 mb-6 w-[clamp(160px,30%,220px)] aspect-[3/4] max-sm:float-none max-sm:w-full max-sm:ml-0 rounded overflow-hidden border border-beige-dark shadow-[4px_4px_20px_hsla(28,22%,34%,0.1)]">
            <img 
              src={portraitImg} 
              alt="André Faye Ndione — portrait" 
              className="w-full h-full object-cover object-[center_20%] block memorial-img" 
              loading="lazy" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://picsum.photos/seed/andre-portrait/800/1200?grayscale";
              }}
            />
          </div>

          <p className="mb-6">
            André Faye Ndione est né le 23 décembre 1973 à Thiès.
          </p>

          <blockquote className="text-[clamp(20px,3vw,28px)] italic font-display text-text-dark font-light border-l-[3px] border-olive pl-6 my-10 leading-[1.6]">
            « Sa force résidait dans son calme, une sérénité qui inspirait le respect et la confiance. »
          </blockquote>

          <p>
            Père aimant de <span className="font-semibold">Marie</span>, époux dévoué de <span className="font-semibold">Florence</span>, frère protecteur et ami fidèle — André laisse derrière lui un héritage de paix et de
            bienveillance qui continuera de guider tous ceux qui l'ont connu. Il rejoint dans la paix son père <span className="font-semibold text-text-dark">Benoit Faye</span> et sa mère <span className="font-semibold text-text-dark">Marie Ndione</span>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BiographySection;
