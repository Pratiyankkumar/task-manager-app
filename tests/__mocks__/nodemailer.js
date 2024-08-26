const nodemailer = {
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({
      messageId: 'mocked-message-id',
    })
  }),
  getTestMessageUrl: jest.fn().mockReturnValue({
    messageId: 'mocked-message-id'
  })
};

module.exports = nodemailer;
