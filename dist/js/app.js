$(function () {
    var $agreement = $('.agreement'),
        $agreementCheck = $agreement.find('.agreement__checkbox'),
        $formSubmit = $agreement.closest('form').find('.form__btn');

    $formSubmit.on('statechange', function () {
        var $this = $(this);

        ($this.prop('disabled')) ?
            $this.prop('disabled', false) :
            $this.prop('disabled', true);
    })

    $agreementCheck.click(function (e) {
        $formSubmit.trigger('statechange');
    })



    window.utils = {
        notification: function (message, duration) {
            var $new_message = $('<div class="notification"></div>'),
                $opened_messages = $('.notification');

            $new_message.html(message);

            if ($opened_messages.length) {
                var $last_message = $opened_messages.last(),
                    top_offset = $last_message[0].offsetTop + $last_message.outerHeight() + 15;

                $new_message.css('top', top_offset + 'px')
            }

            $new_message.appendTo('body');
            $new_message.css('opacity'); //reflow hack for transition
            $new_message.addClass('notification--show');

            if (duration) {
                setTimeout(function () {
                    $new_message.fadeOut(function () {
                        $new_message.remove();
                    })
                }, duration);
            }

            $('.notification').click(function () {
                $(this).fadeOut(function () {
                    $new_message.remove();
                })
            });
        },

        validateForm: function (form) {
            var $form = $(form);

            $form.find('.form__field-alert').remove();

            function showAlert(message) {
                return $('<div class="form__field-alert">' + message + '</div>')
            }

            function checkRequiredField(field) {
                if (field.value) {
                    return true;
                } else {
                    showAlert('Обязательное поле').insertBefore(field);
                    return false;
                }
            }

            function checkEmailField(field) {
                var val = field.value,
                    regexp = /^[0-9a-zА-Яа-я\-\_\.]+\@[0-9a-zА-Яа-я-]{2,}\.[a-zА-Яа-я]{2,}$/i;

                if (val.match(regexp)) {
                    return true;
                } else {
                    showAlert('Введите корректный адрес').insertBefore(field);
                    return false;
                }
            }

            function validateField(field) {
                if ($(field).hasClass('js-required')) {
                    return checkRequiredField(field);
                }
                else if ($(field).hasClass('js-required-email')) {
                    return checkEmailField(field);
                } else {
                    return true;
                }
            }

            var fields = $form.find('input, textarea'),
                isFormValid = true;

            $.each(fields, function (ind, el) {
                var checked_field = validateField(el);
                isFormValid = isFormValid && checked_field;
            });

            return isFormValid;
        }
    }
})