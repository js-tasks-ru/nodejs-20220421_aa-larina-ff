const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('Валидатор проверяет поле name', () => {
      it('валидатор проверяет тип поля name', () => {
        const validator = new Validator({
          name: {
            type: 'string',
          },
        });

        const errors = validator.validate({name: 22});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').
            and.to.be.equal('expect string, got number');
      });

      it('валидатор не проверяет дальнейшие условия, если тип поля name неверный', () => {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 0,
            max: 10,
          },
        });

        const errors = validator.validate({name: ['Field']});

        expect(errors).to.have.length(1);
      });

      describe('валидатор проверяет граничные значения строкового поля', function() {
        const validator = new Validator({
          name: {
            type: 'string',
            min: 10,
            max: 20,
          },
        });

        it('валидатор проверяет минимальную длину строкового поля', () => {
          const errors = validator.validate({name: 'Lalala'});

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('name');
          expect(errors[0]).to.have.property('error')
              .and.to.be.equal('too short, expect 10, got 6');
        });

        it('валидатор проверяет максимальную длину строкового поля', () => {
          const errors = validator.validate({name: 'LalalaLalalaLalalaLalala'});

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('name');
          expect(errors[0]).to.have.property('error')
              .and.to.be.equal('too long, expect 20, got 24');
        });
      });
    });
    describe('Валидатор проверяет поле age', () => {
      it('валидатор проверяет тип поля age', () => {
        const validator = new Validator({
          age: {
            type: 'number',
          },
        });

        const errors = validator.validate({age: '22'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').
            and.to.be.equal('expect number, got string');
      });

      it('валидатор не проверяет дальнейшие условия, если тип поля age неверный', () => {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 18,
            max: 27,
          },
        });

        const errors = validator.validate({age: ['Field']});

        expect(errors).to.have.length(1);
      });

      describe('валидатор проверяет граничные значения числового поля', function() {
        const validator = new Validator({
          age: {
            type: 'number',
            min: 10,
            max: 20,
          },
        });

        it('валидатор проверяет минимальную длину числового поля', () => {
          const errors = validator.validate({age: 9});

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('age');
          expect(errors[0]).to.have.property('error')
              .and.to.be.equal('too little, expect 10, got 9');
        });

        it('валидатор проверяет максимальную длину числового поля', () => {
          const errors = validator.validate({age: 30});

          expect(errors).to.have.length(1);
          expect(errors[0]).to.have.property('field').and.to.be.equal('age');
          expect(errors[0]).to.have.property('error')
              .and.to.be.equal('too big, expect 20, got 30');
        });
      });
    });
    describe('Валидатор проверяет поля совместно', () => {
      it('валидатор проверяет типы полей name и age', () => {
        const validator = new Validator({
          name: {
            type: 'string',
          },
          age: {
            type: 'number',
          },
        });

        const errors = validator.validate({name: ['John'], age: '22'});
        expect(errors).to.have.length(2);
      });
    });
    describe('Валидатор проверяет количество полей', () => {
      it('валидатор проверяет передачу более двух полей', () => {
        const validator = new Validator({
          name: {
            type: 'string',
          },
          age: {
            type: 'number',
          },
        });

        const errors = validator.validate({name: 'John', age: 22, sex: 'male'});
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('sex');
        expect(errors[0]).to.have.property('error')
            .and.to.be.equal('no validation rules for field sex');
      });

      it('валидатор проверяет отсутствие поля из проверяемых', () => {
        const validator = new Validator({
          name: {
            type: 'string',
          },
          age: {
            type: 'string',
          },
        });

        const errors = validator.validate({name: 'John'});
        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error')
            .and.to.be.equal('expect string, got undefined');
      });
    });
  });
});
