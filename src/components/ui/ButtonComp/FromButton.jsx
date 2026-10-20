export const Button = ({ formId }) => (
  <div className="lg:col-span-2 col-span-1 ml-auto">
    <div className="ltr:text-right rtl:text-left">
      <button type="submit" form={formId} className="btn btn-dark text-center">
        Submit
      </button>
    </div>
  </div>
);
