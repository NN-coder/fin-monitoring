const validateSubmitter = (submitter: HTMLElement, form: HTMLFormElement) => {
  if (
    !(
      (submitter instanceof HTMLInputElement || submitter instanceof HTMLButtonElement) &&
      submitter.type === 'submit'
    )
  )
    throw new TypeError(
      "Failed to execute 'requestSubmit' on 'HTMLFormElement': submitter is not a submit button"
    );

  if (submitter.form !== form)
    throw new DOMException(
      "Failed to execute 'requestSubmit' on 'HTMLFormElement': the specified element is not owned by this form element",
      'NotFoundError'
    );
};

export const formRequestSubmitPolyfill = () => {
  if (!HTMLFormElement.prototype.requestSubmit)
    HTMLFormElement.prototype.requestSubmit = function (submitter) {
      if (submitter) {
        validateSubmitter(submitter, this);
        submitter.click();
      } else {
        const newSubmitter = document.createElement('button');
        newSubmitter.type = 'submit';
        newSubmitter.hidden = true;

        this.appendChild(newSubmitter);
        newSubmitter.click();
        this.removeChild(newSubmitter);
      }
    };
};
